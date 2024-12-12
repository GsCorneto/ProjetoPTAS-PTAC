const express = require('express')
const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

class AuthController{
    static async login(req,res){
        const {email, password} = req.body;

        if (!email || !password) {
           return res.status(422).json({
                erro: true,
                 mensagem: "Todos os campos são obrigatórios."
           })}

           const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
           if (!emailCheck.test(email)) {
               return res.status(422).json({
                   erro: true,
                   mensagem: "Email inválido."
            })}   

        if(!password || password.length < 8){
            return res.status(422).json({
                erro: true,
                mensagem: "A senha deve possuir mais de 8 caracteres."
            })}

        const usuario = await prisma.usuario.findFirst({
            where:{
                email:email
            }
        });

        if(!usuario){
            return res.status(422).json({
                erro : true,
                mensagem: "Usuário não encontrado."
            })}

        const passCheck = bcrypt.compareSync(password, usuario.password);

        if(!passCheck){
            return res.status(422).json({
                erro : true,
                mensagem: "Senha incorreta."
            })}

        const token = jwt.sign({ id: usuario.id}, process.env.CHAVE, {
            expiresIn: "1h"
        })

        res.status(200).json({
            erro: false,
            mensagem: "Autenticação efetuada com êxito", 
            token: token
        })
    }

    static async cadastro(req,res){
        const{nome, email, password} = req.body;

        if(!nome || nome.length < 6){
            return res.status(422).json({
                erro: true,
                mensagem: "O nome deve conter mais de 6 caracteres.",
            })}

            const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailCheck.test(email)) {
                return res.status(422).json({
                    erro: true,
                    mensagem: "Email inválido."
             })}  

        if(!password || password.length < 8){
            return res.status(422).json({
                erro: true,
                mensagem: "A senha deve possuir mais de 8 caracteres."
            })}

            const existUser = await prisma.usuario.count({
                where: {
                    email : email,  
                }
            })

            if(existUser != 0){
                return res.status(422).json({
                    erro: true,
                    mensagem: "Já existe um usuário cadastrado com este e-mail."
                })
            }

        const salt = bcrypt.genSaltSync(4);
        const hashPassword = bcrypt.hashSync(password, salt);

            try{
                const usuario = await prisma.usuario.create({
                    data: {
                        nome: nome,
                        email: email,
                        password: hashPassword,
                        tipo: "cliente",
                    }
                });

                const token = jwt.sign({ id: usuario.id}, process.env.CHAVE, {
                    expiresIn: "1h"
                })

                return res.status(201).json({
                    erro: false,
                    mensagem: "Cadastro efetuado com sucesso!",
                    token: token
                })

            } catch (error){
                return res.status(500).json({
                    erro: true,
                    mensagem: "Erro! " + error.message
                })
            }  
            
    }
    static async verificaAutent(req, res, next){}
}
module.exports = AuthController;
