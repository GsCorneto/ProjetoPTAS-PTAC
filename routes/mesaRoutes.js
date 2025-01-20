const express = require("express");
const router = express.Router();

const MesaController = require("../controllers/MesaController")

router.post("/novo", MesaController.cadastrarMesa, MesaController.verificaAdmin);

router.get("/", MesaController.listaMesa);

router.get("/disponibilidade", MesaController.listaMesaDisp);

module.exports = router;