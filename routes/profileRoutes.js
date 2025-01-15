const express = require("express");
const router = express.Router();

const ProfileController = require("../controllers/ProfileController")

router.get("/", ProfileController.visualizar)

router.patch("/", ProfileController.atualizar)

module.exports = router;