const express = require('express')
const prisma = require("../prisma/prismaClient"); 


const app = express();

app.use(express.json());

class MesaController{
    static async cadastrarMesa(req,res){
        const{codigo, n_lugares} = req.body;

        if(!codigo || codigo.length !== 2){
            return res.status(422).json({
                erro: true,
                mensagem: "O código deve conter 2 digitos",
            })}

        const nn_lugar = Number(n_lugares);

        if(!nn_lugar || isNaN(nn_lugar) || nn_lugar > 6){
            return res.status(422).json({
                erro: true,
                mensagem: "Num. Máximo de lugares: 6"
            })}

            const existMesa = await prisma.mesa.count({
                where: {
                    codigo : codigo,  
                }
            })

            if(existMesa != 0){
                return res.status(422).json({
                    erro: true,
                    mensagem: "Já existe uma mesa cadastrada com este código."
                })
            }

            try{
                const mesa = await prisma.mesa.create({
                    data: {
                        codigo: codigo,
                        n_lugares: n_lugares,
                    }
                });

                return res.status(201).json({
                    erro: false,
                    mensagem: "Mesa cadastrada com sucesso!",
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
               mensagem: "Erro ao listar as mesas"
            })
        }
    }

    static async listaMesaDisp(req, res) {
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
    
        const inicioDia = new Date(`${data}T00:00:00.000Z`);
        const fimDia = new Date(`${data}T23:59:59.999Z`);
    
        try {
            const mesasDisponiveis = await prisma.mesa.findMany({
                where: {
                    reservas: {
                        some: {
                            data: {
                                gte: inicioDia,
                                lte: fimDia,
                            },
                            status: true
                        },
                    },
                },
                select: {
                    id: true,
                    codigo: true,
                    n_lugares: true,
                },
            });
    
            if (mesasDisponiveis.length === 0) {
                return res.status(404).json({
                    erro: true,
                    mensagem: "Nenhuma mesa disponível para a data fornecida.",
                });
            }
    
            res.status(200).json({
                erro: false,
                mesas: mesasDisponiveis,
            });
        } catch (err) {
            res.status(500).json({
                erro: true,
                mensagem: "Erro ao listar mesas disponíveis.",
                detalhes: err.message,
            });
        }
    }
    
}

 module.exports = MesaController;