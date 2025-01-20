const express = require('express')
const prisma = require("../prisma/prismaClient"); 
const { connect } = require('../routes/profileRoutes');


const app = express();

app.use(express.json());

class ReservaController{
    static async Reservar(req,res){
        const{n_pessoas, mesaId} = req.body;
        const data = new Date(req.body.data);
            const dataCheck = /^\d{4}-\d{2}-\d{2}$/;
            if (!dataCheck.test(data)) {
             return res.status(422).json({
                erro: true,
                mensagem: "Data inválida. Use o formato yyyy-mm-dd."
             });}

             const mesa = await prisma.mesa.findUnique({
                where: {id: mesaId},
                include: {
                    reservas: {
                        where:{
                            data: data,
                            status: true
                        },
                    },
                },
             });

             //Mesa livre na data
              if(mesa.reservas.length > 0){
                return res.status(400).json({
                    erro: true,
                    mensagem: "Mesa já reservada para esta data."
                })
              }
             


        const nn_pess = Number(n_pessoas);
        if(!nn_pess || isNaN(nn_pess) || nn_pess > 6){
            return res.status(422).json({
                erro: true,
                mensagem: "Este é o limite de uma mesa, Reserva uma mesa adicional"
            })}
            
            try{
                const reserva = await prisma.reserva.create({
                    data: {
                        data: data,
                        n_pessoas: n_pessoas,
                        usuario:{
                            connect:{
                                id: req.usuarioId,
                            },
                        },
                        mesa:{
                            connect:{
                                id: mesaId,
                            }
                        },
                    },
                })

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

    static async listarReserva(req, res){
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

    static async Cancelar(req, res){
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
    static async listaRData(req, res){
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


}

 module.exports = ReservaController;