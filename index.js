const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

const express = require("express");
const app = express ();


const authRoute = require("../routes/authRouters")
app.use("/auth", authRoutes);

app.listen(8000);
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