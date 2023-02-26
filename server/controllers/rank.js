const Rank = require("../models/rank");

const getRanks = async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}]: Get Rank is called!`);
    const ranks = await Rank.find({});
    let results = [];
    for (const rank of ranks) {
      results.push({
        keyword: rank.keyword,
        store: rank.store,
        title: rank.title,
        ...rank.rank,
      });
    }
    console.log(`[${new Date().toISOString()}]: Sending Rank data`);
    return res.status(201).json({ msg: "SUCCESS", results });
  } catch (error) {
    return res.status(500).json({ msg: error.message || "ERROR" });
  }
};

module.exports = {
  getRanks,
};
