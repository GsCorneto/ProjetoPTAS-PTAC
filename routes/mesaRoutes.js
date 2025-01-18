const express = require("express");
const router = express.Router();

const MesaController = require("../controllers/MesaController")

router.post("/novo", MesaController.cadastro);

router.post("/", MesaController.login);

router.post("/disponibilidade", MesaController.login);

module.exports = router;