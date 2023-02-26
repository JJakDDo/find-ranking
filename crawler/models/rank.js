const mongoose = require("mongoose");

const rankSchema = mongoose.Schema({
  keyword: String,
  store: String,
  title: String,
  rank: {
    rank: Number,
    position: String,
    upOrDown: String,
    changeInRank: Number,
  },
  history: [],
});

const Rank = mongoose.model("Rank", rankSchema);

module.exports = Rank;
