import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function limparBanco() {
  try {
    // Ordem importa para respeitar chaves estrangeiras
    await prisma.itemVenda.deleteMany()
    await prisma.venda.deleteMany()
    await prisma.despesa.deleteMany()
    await prisma.produto.deleteMany()
    await prisma.viagem.deleteMany()

    console.log("Dados apagados com sucesso.")
  } catch (error) {
    console.error("Erro ao apagar dados:", error)
  } finally {
    await prisma.$disconnect()
  }
}

limparBanco()
