const express = require('express')
const prisma = require("../prisma/prismaClient"); 
const { connect } = require('../routes/profileRoutes');


const app = express();

app.use(express.json());

class ReservaController{
    static async Reservar(req,res){
        const{data, n_pessoas, mesaId} = req.body;

            const dataCheck = /^\d{4}-\d{2}-\d{2}$/;
            if (!dataCheck.test(data)) {
             return res.status(422).json({
                erro: true,
                mensagem: "Data inválida. Use o formato yyyy-mm-dd." 
                
             });}

            // Postman tava pedindo formato ISO-8601 DateTime
             const dataISO = new Date(`${data}T00:00:00.000Z`);
             if(dataISO.toString() === "Invalid Date"){
                return res.status(422).json({
                    erro: true,
                    mensagem: "Formato da data é inválido"
                })
             }


            const hoje = new Date();
            if (data < hoje.setHours(0, 0, 0, 0)) {
             return res.status(422).json({
                erro: true,
                mensagem: "Voce literalmente quer a mesa pra ontem."
            });
            }

            const mesID = Number(mesaId);
            if (isNaN(mesID) || mesID <= 0) {
                return res.status(400).json({
                    erro: true,
                    mensagem: "ID da mesa inválido."
                });
            }

            const nn_pess = Number(n_pessoas);
            if(!nn_pess || isNaN(nn_pess) || nn_pess > 6){
                 return res.status(422).json({
                erro: true,
                mensagem: "Este é o limite de uma mesa, Reserva uma mesa adicional"
            })}
            
             const mesa = await prisma.mesa.findUnique({
                where: {id: mesID}
             });

            if(!mesa) {
                return res.status(404).json({
                    erro: true,
                    mensagem: "Mesa não encontrada."
                });
            }

            const reservaExiste = await prisma.reserva.findMany({
                where: {
                    mesaId: mesID,
                    data: dataISO,
                    status: true
                }
            })

            if (reservaExiste.length > 0){
                return res.status(400).json({
                    erro: true,
                    mensagem: "Mesa já reservada para esta data"
                })
            }
            
            try{
                const reserva = await prisma.reserva.create({
                    data: {
                        data: dataISO,
                        n_pessoas: nn_pess,
                        usuario:{
                            connect:{
                                id: req.usuarioId,
                            },
                        },
                        mesa:{
                            connect:{
                                id: mesID,
                            }
                        },
                    },
                })

                await prisma.mesa.update({
                    where: {id: mesID},
                    data: {status: false}
                })

                return res.status(201).json({
                    erro: false,
                    mensagem: "Reserva efetuada com sucesso!",
                    reserva: reserva
                })

            }catch (error){
                return res.status(500).json({
                    erro: true,
                    mensagem: "Erro! " + error.message
                })
            }       
    }

    static async listarReserva(req, res){
        try{
        
            const usuarioId = req.usuarioId

            const reservas = await prisma.reserva.findMany({
                where:{
                    usuarioId: usuarioId,
                },
                select:{
                    Id: true,
                    data: true,
                    n_pessoas: true,
                      mesa:{
                         select:{
                            id: true,
                             codigo: true,
                             n_lugares: true
                         }
                     }
                }
        });
        


        return res.status(200).json({
            erro: false,
            reservas: reservas,
        });

        }catch (err){
            return res.status(500).json({
               erro: true,
               mensagem: "Erro ao listar" + err
            })
            
        }
    }

    static async Cancelar(req, res){
        const {reservaId} = req.body;

        
        if(!reservaId || isNaN(reservaId)){
            return res.status(422).json({
                erro: true,
                mensagem: "ID da reserva inválido."
            });
        }
        try{
            const reserva = await prisma.reserva.findUnique({
                where: {Id: Number(reservaId)}
            });
            if(!reserva){
                return res.status(404).json({
                    erro: true,
                    mensagem: "Erro ao encontrar a reserva"
                });
            }
            await prisma.reserva.delete({
                where: { Id: Number(reservaId)}
            });

            return res.status(200).json({
                erro: false,
                mensagem: "Reserva cancelada!"
            })

        }catch(error){
            return res.status(500).json({
                erro: true,
                mensagem: "Erro ao cancelar a reserva: " + error.message,
            })
        }
    }

    static async listaRData(req, res) {
        const { data } = req.query;
    
        if (!data) {
            return res.status(422).json({
                erro: true,
                mensagem: "Insira a data.",
            });
        }
    
        const dataCheck = /^\d{4}-\d{2}-\d{2}$/;
        if (!dataCheck.test(data)) {
            return res.status(422).json({
                erro: true,
                mensagem: "Data inválida. Use o formato yyyy-mm-dd.",
            });
        }
    
        const inicioDia = new Date(data);
        inicioDia.setHours(0, 0, 0, 0);

        const fimDia = new Date(data);
        fimDia.setHours(23, 59, 59, 999);
    
        try {
            const reservasDisp = await prisma.reserva.findMany({
                where: {
                    data: {
                        gte: inicioDia,
                        lte: fimDia,
                    },
                },
                select: {
                    Id: true,
                    n_pessoas: true,
                    status: true,
                    usuario: {
                        select: {
                            id: true,
                            nome: true,
                            email: true,
                        },
                    },
                    mesa: {
                        select: {
                            id: true,
                            codigo: true,
                            n_lugares: true,
                        },
                    },
                },
            });
    
            if (reservasDisp.length === 0) {
                return res.status(404).json({
                    erro: true,
                    mensagem: "Nenhuma reserva disponível para a data fornecida.",
                });
            }
    
            res.status(200).json({
                erro: false,
                reservas: reservasDisp,
            });
        } catch (err) {
            res.status(500).json({
                erro: true,
                mensagem: "Erro ao listar reservas disponíveis.",
                detalhes: err.message,
            });
        }
    }
    
}

 module.exports = ReservaController;