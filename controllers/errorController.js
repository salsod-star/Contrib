const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: (${err.keyValue.name}). Please use another value`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(
    (error) => `${error.path}: ${error.message}`
  );

  const message = `Invalid input field(s). ${errors}`;

  return new AppError(message, 400);
};

const handleJWTError = () => new AppError("Invalid token. Please login again", 401);
const handleJWTExpiredError = () =>
  new AppError("Your token has expired. Please login again", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(`Error: ${err}`);

    res.status(500).json({
      status: "error",
      message: "something went very wrong!",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.name === "JsonWebTokenError") err = handleJWTError(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    if (err.name === "TokenExpiredError") err = handleJWTExpiredError(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);

    sendErrorProd(err, res);
  }
};

module.exports = globalErrorHandler;
