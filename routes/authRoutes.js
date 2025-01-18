const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController")

router.post("/cadastro", AuthController.cadastro);

router.post("/login", AuthController.login);




module.exports = router;