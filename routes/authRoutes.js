const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController")

router.post("/cadastro", AuthController.cadastro);

router.post("/login", AuthController.login);

router.post("/cadastroMesa", AuthController.verificaAutent, AuthController.verificaAdmin);

module.exports = router;