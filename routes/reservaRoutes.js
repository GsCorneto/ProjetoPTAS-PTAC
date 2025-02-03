const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController")
const ReservaController = require("../controllers/ReservaController")

router.post("/novo", ReservaController.Reservar)

router.get("/", ReservaController.listarReserva)

router.delete("/", ReservaController.Cancelar)

router.get("/list", AuthController.verificaAdmin, ReservaController.listaRData)

module.exports = router;