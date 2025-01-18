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
     static async todos(req, res){
        const {email, password} = req.body;
        const authHeader = req.headers["authorization"];
        const passe = authHeader && authHeader.split(" ")[1];

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

        const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo}, process.env.CHAVE, {
            expiresIn: "1h"
        })

        res.status(200).json({
            erro: false,
            mensagem: "Autenticação efetuada com êxito", 
            token: token
        })
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