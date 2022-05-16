import express from "express";
const router = express.Router();

const {
  getControlAcceso,
  putControlAcceso,
} = require("../controllers/controlacceso");

router.route("/").get(getControlAcceso).put(putControlAcceso);

module.exports = router;
