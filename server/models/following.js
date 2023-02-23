const mongoose = require("mongoose");

const followingSchema = mongoose.Schema({
  keyword: String,
  store: String,
});

const Following = mongoose.model("Following", followingSchema);

module.exports = Following;
