const express = require("express");
const router = express.Router();
const { getRanks } = require("../controllers/rank");

router.get("/", getRanks);

module.exports = router;
