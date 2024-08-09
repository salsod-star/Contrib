const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const cors = require("cors");

const contributionRouter = require("./routes/contribRoutes");
const contributorRouter = require("./routes/ContributorRoutes");
const userRouter = require("./routes/userRoutes");
const groupRouter = require("./routes/groupRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

app.use(cors());
app.options("*", cors());

// SECURITY HEADERS
app.use(helmet());

dotenv.config({ path: "./config.env" });

// DEVELOPMENT LOGGING
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// LIMIT REQUESTS FROM SAME API
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

// BODY PARSER, reading data from body into req.body
app.use(express.json({ limit: "1mb" }));

// DATA SANITIZATION: against NoSQL query attack
app.use(mongoSanitize());

// DATA SANITIZATION: against xss attack
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.use(compression());

app.use("/api/v1/contributions", contributionRouter);
app.use("/api/v1/contributors", contributorRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/groups", groupRouter);

app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
