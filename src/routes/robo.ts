import express from "express";
const router = express.Router();

const {
    getRobo,
    getRoboDisponible,
    getRoboSimple,
    getActivo,
    putRobo
} = require("../controllers/robo");

router.route("/").get(getRobo).put(putRobo);
router.route("/disponible").get(getRoboDisponible);
router.route("/activo").get(getActivo);
router.route("/simple").get(getRoboSimple);

module.exports = router;
