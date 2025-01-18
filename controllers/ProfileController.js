const prisma = require("../prisma/prismaClient");

class ProfileController{
    static async visualizar(req, res){
        const usuario = await prisma.usuario
        .findUnique({
            where: {id: req.usuarioId},
            omit: {password: true}
        })
    }

    static async atualizar(req, res){
        const{nome, email} = req.body;
        prisma.usuario.update({
            where: {
                id: req.usuarioId
            },
            data: {
                email: email,
                nome: nome,
            }
        })
    }
     static async listaUsuario(req, res){
        const authHeader = req.headers["authorization"];
        const passe = authHeader && authHeader.split(" ")[1];

        if (!passe) {
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
                } catch(err){
                    return res.status(500).json({
                        erro: true,
                        mensagem: "Erro ao listar"
                    })
                }
                req.usuarioTipo = payload.tipo;
                next();
            });
    }
}


module.exports = ProfileController;