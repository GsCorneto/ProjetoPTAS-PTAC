const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController")
const MesaController = require("../controllers/MesaController")

router.post("/novo",AuthController.verificaAutent, AuthController.verificaAdmin, MesaController.cadastrarMesa );

router.get("/", MesaController.listaMesa);

router.get("/disponibilidade", MesaController.listaMesaDisp);

module.exports = router;