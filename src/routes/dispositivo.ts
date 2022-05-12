import express from "express";
const router = express.Router();

const {
  postDispositivo,
  getDispositivo,
  deleteDispositivo,
  postDispositivoEstado,
  getDispositivoEstado,
  getDispositivoNoReg,
} = require("../controllers/dispositivo");

router
  .route("/")
  .get(getDispositivo)
  .post(postDispositivo)
  .delete(deleteDispositivo);
router.route("/noregistrado").get(getDispositivoNoReg);
router.route("/estado").get(getDispositivoEstado).post(postDispositivoEstado);

module.exports = router;
