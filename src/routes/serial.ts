import express from "express";

const router = express.Router();

const { getEntradas, getSalidas, getFuente, putAceptacion } = require("../controllers/serial");

router.route("/entradas").get(getEntradas);
router.route("/salidas").get(getSalidas);
router.route("/fuente").get(getFuente);
router.route('/ack').put(putAceptacion);

module.exports = router;
