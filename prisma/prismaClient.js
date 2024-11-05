const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

console.log("Prisma funcionando com sucesso!")

module.exports = prisma