const Following = require("../models/following");
const { crawl } = require("../utils/crawl");

const addFollowing = async (req, res) => {
  try {
    const { keyword, store } = req.body;
    if (!keyword || !store) {
      throw new Error("Request body is insufficient!");
    }

    const isExist = await Following.findOne({ keyword, store });

    if (isExist) {
      console.log(
        `[${new Date().toISOString()}]: Keyword: ${keyword}, Store: ${store} is already exist!`
      );
      return res.status(201).json({ msg: "SUCCESS", following: isExist });
    }

    const addedFollowing = await Following.create({
      keyword,
      store,
    });
    const rank = await crawl(keyword, store);
    console.log(
      `[${new Date().toISOString()}]: Keyword: ${keyword}, Store: ${store} is added!`
    );
    return res.status(201).json({
      msg: "SUCCESS",
      rank: {
        keyword: rank.keyword,
        store: rank.store,
        title: rank.title,
        ...rank.rank,
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message || "ERROR" });
  }
};

const deleteFollowing = async (req, res) => {
  try {
    const { keyword, store } = req.body;
    if (!keyword || !store) {
      throw new Error("Request body is insufficient!");
    }

    const deletedFollowing = await Following.deleteOne({
      keyword,
      store,
    });
    console.log(
      `[${new Date().toISOString()}]: Keyword: ${keyword}, Store: ${store} is deleted!`
    );
    return res.status(201).json({ msg: "SUCCESS", ...deletedFollowing });
  } catch (error) {
    return res.status(500).json({ msg: error.message || "ERROR" });
  }
};

module.exports = {
  addFollowing,
  deleteFollowing,
};
