const express = require("express");
const router = express.Router();

const MesaController = require("../controllers/MesaController")

router.post("/cadastro", MesaController.cadastro);

router.post("/login", MesaController.login);

module.exports = router;