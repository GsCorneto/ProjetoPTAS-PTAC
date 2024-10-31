const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

const bcrypt = require("bcryptjs"); 

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

            const existUser = await prisma.usuario.count({
                where: {
                    email : email,  
                }
            })

            if(existUser != 0){
                return res.json({
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

                return res.json({
                    erro: false,
                    mensagem: "Cadastro efetuado com sucesso!"
                })

            } catch (error){
                return res.json({
                    erro: true,
                    mensagem: "Erro! " + error
                })
            }
            

            
    }
}

module.exports = AuthController;