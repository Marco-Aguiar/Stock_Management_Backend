import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function criarUsuarioService(data: { nome: string; email: string; senha: string }) {
  // aqui você pode aplicar criptografia se quiser
  return prisma.usuario.create({ data })
}

export async function buscarUsuarioPorEmailService(email: string) {
  return prisma.usuario.findUnique({ where: { email } })
}
