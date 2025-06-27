import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

type ViagemInput = {
  destino: string
  motorista: string
  dataSaida: string | Date
  dataRetorno: string | Date
}

export async function criarViagemService(data: ViagemInput) {
  return prisma.viagem.create({
    data: {
      destino: data.destino,
      motorista: data.motorista,
      dataSaida: new Date(data.dataSaida),
      dataRetorno: new Date(data.dataRetorno)
    }
  })
}

export async function listarViagensService() {
  return prisma.viagem.findMany({
    include: {
      despesas: true,
      vendas: {
        include: {
          itens: true,
        },
      },
    },
    orderBy: { dataSaida: "desc" },
  })
}


export async function calcularBalancoViagemService(viagemId: number) {
  const viagem = await prisma.viagem.findUnique({
    where: { id: viagemId },
    include: {
      despesas: true,
      vendas: {
        include: {
          itens: {
            include: { produto: true },
          },
        },
      },
    },
  })

  if (!viagem) throw new Error("Viagem não encontrada")

  const totalDespesas = viagem.despesas.reduce((soma, d) => soma + d.valor, 0)

  const totalReceita = viagem.vendas.flatMap(v => v.itens)
    .reduce((soma, item) => soma + item.precoUnit * item.quantidade, 0)

  const totalCusto = viagem.vendas.flatMap(v => v.itens)
    .reduce((soma, item) => soma + item.produto.precoCompra * item.quantidade, 0)

  const lucro = totalReceita - totalCusto - totalDespesas

  return {
    viagem: {
      id: viagem.id,
      destino: viagem.destino,
      motorista: viagem.motorista,
      dataSaida: viagem.dataSaida,
      dataRetorno: viagem.dataRetorno,
    },
    totalDespesas,
    totalReceita,
    totalCusto,
    lucro,
  }
}

export async function getBalancoGeralService() {
  const todasVendas = await prisma.venda.findMany({
    include: {
      itens: { include: { produto: true } },
    },
  })

  const todasDespesas = await prisma.despesa.findMany()

  const totalVendas = todasVendas.reduce((total, venda) => {
    const valorVenda = venda.itens.reduce((soma, item) => {
      return soma + item.quantidade * item.precoUnit
    }, 0)
    return total + valorVenda
  }, 0)

  const totalCusto = todasVendas.reduce((total, venda) => {
    const custoVenda = venda.itens.reduce((soma, item) => {
      return soma + item.quantidade * item.produto.precoCompra
    }, 0)
    return total + custoVenda
  }, 0)

  const totalDespesas = todasDespesas.reduce((total, despesa) => {
    return total + despesa.valor
  }, 0)

  const lucro = totalVendas - totalCusto - totalDespesas

  return {
    totalVendas,
    totalCusto,
    totalDespesas,
    lucro,
  }
}
