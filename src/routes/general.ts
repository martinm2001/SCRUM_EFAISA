import express from "express";
const router = express.Router();

const {
  getGeneral,
  postGeneral,
  getManual,
  putManual,
  login,
  logout,
  getReporte,
  getTelegram,
  putTelegram,
  putCodigoAcceso,
} = require("../controllers/general");

router.route("/").get(getGeneral).post(postGeneral);
router.route("/manual").get(getManual).put(putManual);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/reporte").get(getReporte);
router.route("/telegram").get(getTelegram).put(putTelegram);
router.route("/codigoacceso").put(putCodigoAcceso);

module.exports = router;
