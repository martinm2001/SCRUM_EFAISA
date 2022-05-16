import express from "express";
const router = express.Router();

const {
    getAudioEvac,
    getActivo,
    putAudioEvac
} = require("../controllers/audioevac");

router.route("/").get(getAudioEvac).put(putAudioEvac);
router.route("/activo").get(getActivo);

module.exports = router;
