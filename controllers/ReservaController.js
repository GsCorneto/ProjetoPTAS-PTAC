const express = require('express')
const prisma = require("../prisma/prismaClient"); 
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

class ReservaController{
    static async Reservar(req,res){
        const{data, n_pessoas, mesaID} = req.body;

            const dataCheck = /^\d{4}-\d{2}-\d{2}$/;
            if (!dataCheck.test(data)) {
             return res.status(422).json({
                erro: true,
                mensagem: "Data inválida. Use o formato yyyy-mm-dd."
             });}

        const nn_pess = Number(n_pessoas);

        if(!nn_pess || isNaN(nn_pess) || nn_pess > 6){
            return res.status(422).json({
                erro: true,
                mensagem: "Este é o limite de uma mesa, Reserva uma mesa adicional"
            })}
            const existMesa = await prisma.mesa.findUnique({
                where: {
                    id : mesaID,  
                }
            })

            if(!existMesa ){
                return res.status(422).json({
                    erro: true,
                    mensagem: "Mesa não encontrada"
                })
            }

            const existReserva = await prisma.mesa.findFirst({
                where: {
                    codigo : codigo,  
                }
            })

            if(existReserva != 0){
                return res.status(422).json({
                    erro: true,
                    mensagem: "Já existe uma mesa cadastrado com este código."
                })
            }

            try{
                const reserva = await prisma.reserva.create({
                    data: {
                        data: data,
                        n_pessoas: n_pessoas,
                        mesaId: mesaID
                    }
                });

                return res.status(201).json({
                    erro: false,
                    mensagem: "Reserva efetuada com sucesso!",
                })

            } catch (error){
                return res.status(500).json({
                    erro: true,
                    mensagem: "Erro! " + error.message
                })
            }       
    }

    static async listaMesa(req, res){
        try{
            const mesas = await prisma.mesa.findMany({
            select: {
                id: true,
                codigo: true,
                n_lugares: true,
                }
        });
            res.status(200).json({
                 erro: false,
                 mesas: mesas
           });
        }catch (err){
            return res.status(500).json({
               erro: true,
               mensagem: "Erro ao listar"
            })
        }
    }

    static async listaMesaDisp(req, res){
        const {data} = req.query;

        if (!data){
            return res.status(422).json({
                erro: true,
                mensagem: "Insira a data."
            })
        }
        const dataCheck = /^\d{4}-\d{2}-\d{2}$/;
        if (!dataCheck.test(data)) {
         return res.status(422).json({
            erro: true,
            mensagem: "Data inválida. Use o formato yyyy-mm-dd."
         });
        }
        try {
         const mesasDisponiveis = await prisma.mesa.findMany({
            where: {
                reservas: {
                    none: {data_reserva: data
                    }
                }
            },
            select: {
                id: true,
                codigo: true,
                n_lugares: true,
                reservas: true
            }
         });

        if (mesasDisponiveis.length === 0) {
            return res.status(404).json({
                erro: true,
                mensagem: "Nenhuma mesa disponível para a data fornecida."
            });
        }

        
        res.status(200).json({
            erro: false,
            mesas: mesasDisponiveis
        });

    } catch (err) {
        res.status(500).json({
            erro: true,
            mensagem: "Erro ao listar mesas disponíveis.",
            detalhes: err.message
        });
    }}


static async verificaAdmin(req, res, next){
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(422).json(
            { mensagem: "Token não encontrado." })
    }

    jwt.verify(token, process.env.CHAVE, (err, payload) => {
        if (err) {
            return res.status(401).json({ mensagem: "Token Inválido." });
        }

        if (payload.tipo !== "admin") {
            return res.status(403).json({ mensagem: "Nah, ah ,ah Você não disse a palavra mágica!" });
        }
        req.usuarioTipo = payload.tipo;
        next();
    });
 }}

 module.exports = ReservaController;