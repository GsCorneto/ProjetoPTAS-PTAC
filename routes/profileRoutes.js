const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController")
const ProfileController = require("../controllers/ProfileController")

router.get("/", ProfileController.visualizar)

router.patch("/",  ProfileController.atualizar)

router.get("/todos",AuthController.verificaAdmin, ProfileController.listaUsuario)

// console.log("ProfileController.visualizar:", ProfileController.visualizar);
// console.log("ProfileController.atualizar:", ProfileController.atualizar);
// console.log("ProfileController.todos:", ProfileController.listaUsuario);

module.exports = router;