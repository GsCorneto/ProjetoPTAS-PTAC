const express = require('express')
const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

class MesaController{
    static async cadastrarMesa(req,res){
        const{codigo, n_lugares} = req.body;

        if(!codigo || codigo.length < 6){
            return res.status(422).json({
                erro: true,
                mensagem: "O nome deve conter mais de 6 caracteres.",
            })}

        if(!password || password.length < 8){
            return res.status(422).json({
                erro: true,
                mensagem: "A senha deve possuir mais de 8 caracteres."
            })}

            const existUser = await prisma.mesa.count({
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
    }}