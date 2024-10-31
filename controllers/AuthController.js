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
        const{nome, email, password} = req.body;

        if(!nome || nome.lenght < 6){
            return res.json({
                erro: true,
                mensagem: "O nome deve conter mais de 6 caracteres."
            })}

        if(!email || email.lenght < 10){
            return res.json({
                erro: true,
                mensagem: "Email inválido."
            })}

        if(!password || password.lenght < 8){
            return res.json({
                erro: true,
                mensagem: "A senha deve possuir mais de 8 caracteres."
            })}

            return res.json({
                erro: false,
                mensagem: "Cadastro efetuado com sucesso!"
            })
    }
}

module.exports = AuthController;