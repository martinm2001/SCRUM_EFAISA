import express from "express";
const router = express.Router();

const { getTecnica } = require("../controllers/tecnica");

router.route("/").get(getTecnica);

module.exports = router;
