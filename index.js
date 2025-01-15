const prisma = require("./prisma/prismaClient")
const cors = require("cors")

// const corsAllow = {
//     origin: '*',
//     methods: 'GET,HEAD,POST,PATCH,DELETE',
//     allowedHeaders: 'Content-Type, Authorization',
// };

const AuthController = require("./controllers/AuthController")

const express = require("express");

const app = express ();
app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(cors());

//rotas autentificação
const authRoutes = require("./routes/authRoutes")
app.use("/auth", authRoutes);

// const profileRoutes = require("./routes/profileRoutes");
// app.use("/perfil", profileRoutes)

// app.get("/meus-pedidos"), AuthController.verificaAutent, (req, res) =>
// {
//     res.json({pedidos: 'lista de pedidos do usuário'})
// }



app.listen(8900);
// async function run(){
//     //Insert usuario
//  await prisma.usuario.create({
//     data: {
//     nome: "Godofredo",
//     email: "godofredo.lindo@gmail.com"
//     },
// });

// const usuarios = await prisma.usuario.findMany();
// console.log("Novo Usuário: " + JSON.stringfy)
// console.log(usuarios)
// }


// run()