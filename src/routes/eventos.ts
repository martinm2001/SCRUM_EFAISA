import express from "express";
const router = express.Router();

const {
  getEventos,
  postEventos,
  putEventos,
  deleteEvento,
  postActEventoManual,
  postDesactEventoManual,
} = require("../controllers/eventos");
router
  .route("/")
  .get(getEventos)
  .post(postEventos)
  .put(putEventos)
  .delete(deleteEvento);
router.route("/manual/activar").post(postActEventoManual);
router.route("/manual/desactivar").post(postDesactEventoManual);
module.exports = router;
