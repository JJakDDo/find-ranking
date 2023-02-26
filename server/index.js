require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const followingRoute = require("./routes/following");
const rankRoute = require("./routes/rank");

const app = express();

app.use(cors());
app.use(express.json({ extende: true }));

app.use("/following", followingRoute);
app.use("/rank", rankRoute);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const PORT = process.env.PORT || "4000";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is Listening on Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
