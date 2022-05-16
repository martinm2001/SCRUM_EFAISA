import express from "express";

const router = express.Router();

const {
  getMangueras,
  postMangueras,
  putMangueras,
  deleteMangueras,
  getManguerasVencidosAno,
  getManguerasProntoVencerAno,
  getManguerasVencidosPH,
  getManguerasProntoVencerPH,
} = require("../controllers/mangueras");

router
  .route("/")
  .get(getMangueras)
  .post(postMangueras)
  .put(putMangueras)
  .delete(deleteMangueras);
router.route("/vencidos/ano").get(getManguerasVencidosAno);
router.route("/prontovencer/ano").get(getManguerasProntoVencerAno);
router.route("/vencidos/ph").get(getManguerasVencidosPH);
router.route("/prontovencer/ph").get(getManguerasProntoVencerPH);

module.exports = router;
