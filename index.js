const prisma = require("./prisma/prismaClient")

const express = require("express");

const app = express ();
app.use(express.json());

app.use(express.urlencoded({extended: true}));

const authRoutes = require("./routes/authRoutes")
app.use("/auth", authRoutes);


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