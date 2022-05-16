import express from "express";

const router = express.Router();

const {
  getExtintores,
  postExtintores,
  putExtintor,
  deleteExtintor,
  getExtintoresVencidosAno,
  getExtintoresProntoVencerAno,
  getExtintoresVencidosCarga,
  getExtintoresProntoVencerCarga,
  getExtintoresVencidosPH,
  getExtintoresProntoVencerPH,
} = require("../controllers/extintores");

router
  .route("/")
  .get(getExtintores)
  .post(postExtintores)
  .put(putExtintor)
  .delete(deleteExtintor);
router.route("/vencidos/ano").get(getExtintoresVencidosAno);
router.route("/prontovencer/ano").get(getExtintoresProntoVencerAno);
router.route("/vencidos/carga").get(getExtintoresVencidosCarga);
router.route("/prontovencer/carga").get(getExtintoresProntoVencerCarga);
router.route("/vencidos/ph").get(getExtintoresVencidosPH);
router.route("/prontovencer/ph").get(getExtintoresProntoVencerPH);

module.exports = router;
