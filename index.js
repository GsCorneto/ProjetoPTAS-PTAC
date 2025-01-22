const prisma = require("./prisma/prismaClient")
const cors = require("cors")

const AuthController = require("./controllers/AuthController")

const express = require("express");

const app = express ();
app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(cors());

//rotas da aplicação
const authRoutes = require("./routes/authRoutes")
app.use("/auth", authRoutes);
const mesaRoutes = require("./routes/mesaRoutes")
app.use("/mesa", mesaRoutes);
const profileRoutes = require("./routes/profileRoutes")
app.use("/perfil",AuthController.verificaAutent, profileRoutes);
const reservaRoutes = require("./routes/reservaRoutes")
app.use("/reservas",AuthController.verificaAutent, reservaRoutes);

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