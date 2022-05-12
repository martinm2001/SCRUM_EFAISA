import express from "express";
const router = express.Router();

const {
  getInfoIN,
  getAliasIN,
  postAliasIN,
  getDescIN,
  postDescIN,
  postTipoIN,
  getCamara,
  postCamara,
  getImagen,
  getDesconexionIN,
  putDesconexionIN,
} = require("../controllers/inout");

router.route("/infoin").get(getInfoIN);
router.route("/aliasin").get(getAliasIN).post(postAliasIN);
router.route("/descripcionin").get(getDescIN).post(postDescIN);
router.route("/tipoin").post(postTipoIN);
router.route("/camara").get(getCamara).post(postCamara);
router.route("/imagen").get(getImagen);
router.route("/desconexion").get(getDesconexionIN).put(putDesconexionIN);

module.exports = router;
