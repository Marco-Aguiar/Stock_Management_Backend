import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

type DespesaInput = {
  tipo: string
  valor: number
  viagemId: number
}

export async function criarDespesaService(data: DespesaInput) {
  const { tipo, valor, viagemId } = data

  const viagem = await prisma.viagem.findUnique({
    where: { id: viagemId },
  })

  if (!viagem) throw new Error("Viagem não encontrada")

  return prisma.despesa.create({
    data: {
      tipo,
      valor,
      viagemId,
    },
  })
}

export async function listarDespesasService() {
  return prisma.despesa.findMany({
    include: {
      viagem: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getRelatorioDespesasService(viagemId?: string) {
  const where = viagemId ? { viagemId: Number(viagemId) } : {}

  const despesas = await prisma.despesa.findMany({
    where,
    include: { viagem: true }
  })

  const total = despesas.reduce((acc, despesa) => acc + despesa.valor, 0)

  return {
    totalDespesas: total,
    quantidadeDespesas: despesas.length,
    despesasDetalhadas: despesas
  }
}
