import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function obterBalancoViagem(viagemId: number) {
  const despesas = await prisma.despesa.findMany({
    where: { viagemId },
  })

  const vendas = await prisma.venda.findMany({
    where: { viagemId },
    include: {
      itens: true,
    },
  })

  const custoTotal = despesas.reduce((soma, d) => soma + d.valor, 0)

  const receitaTotal = vendas.reduce((total, venda) => {
    return total + venda.itens.reduce((soma, item) => soma + item.precoUnit * item.quantidade, 0)
  }, 0)

  const lucro = receitaTotal - custoTotal

  return { receitaTotal, custoTotal, lucro }
}
