const express = require("express");
const router = express.Router();

const ReservaController = require("../controllers/ReservaController")

router.get("/", ReservaController.visualizar)

router.patch("/", ReservaController.atualizar)

module.exports = router;