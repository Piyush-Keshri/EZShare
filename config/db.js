require("dotenv").config();
const mongoose = require("mongoose");

function connectDB() {
  // Database Connection
  mongoose.connect(process.env.MONGO_COONECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const connection = mongoose.connection;

  connection
    .once("open", function () {
      console.log("MongoDB running");
    })
    .on("error", function (err) {
      console.log(err);
    });
}
module.exports = connectDB;
