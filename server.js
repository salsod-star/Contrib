const app = require("./app");
const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.error(err.message);
  });

const port = process.env.PORT || 4000;

const server = app.listen(port, () =>
  console.log(`${process.env.NODE_ENV} server is listening on port:${port}`)
);

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
