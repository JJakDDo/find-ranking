const express = require("express");
const router = express.Router();
const { addFollowing, deleteFollowing } = require("../controllers/following");

router.post("/", addFollowing).delete("/", deleteFollowing);

module.exports = router;
