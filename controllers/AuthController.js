const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

class AuthController{
    static async login(req,res){
        res.json({
            email: req.body.email,
            senha: req.body.senha
        })

    }

    static async cadastro(req,res){
        

    }
}

module.exports = AuthController;