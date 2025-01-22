const prisma = require("../prisma/prismaClient");
const jwt = require("jsonwebtoken")

class ProfileController{
    static async visualizar(req, res){
       try{ 
        const usuario = await prisma.usuario
        .findUnique({
            where: {id: req.usuarioId},
            select:{
                id: true,
                nome: true,
                email: true,
                tipo: true
            }
        });
        if (!usuario) {
            return res.status(404).json({ erro: true, mensagem: "Usuário não encontrado." });
        }
        res.status(200).json({ erro: false, usuario });
        } catch (err) {
        res.status(500).json({ erro: true, mensagem: "Erro ao buscar o perfil." });
    }
    }
    static async atualizar(req, res){
        const{nome, email} = req.body;

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

        try{
            const userAtt = await prisma.usuario.update({
                where: {id: req.usuarioId},
                data: {email, nome}
            });
            res.status(200).json({ erro: false, mensagem: "Perfil atualizado com sucesso!", usuario: userAtt });
        } catch (err){
            res.status(500).json({ erro: true, mensagem: "Ocorreu um erro ao atualizar." });
        }
    }
    static async listaUsuario(req, res){
            try{
                const usuarios = prisma.usuario.findMany({
                    select: {
                       id: true,
                       nome: true,
                       email: true,                           
                       tipo: true,
                       reservas: true
                    }
                });
               res.status(200).json({
                       erro: false,
                       usuarios: usuarios
                });
            }catch(err){
                    return res.status(500).json({
                        erro: true,
                        mensagem: "Erro ao listar"
                    })
            }
    };
}



module.exports = ProfileController;