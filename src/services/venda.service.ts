import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

type ItemVendaInput = {
  produtoId: number
  quantidade: number
}

type VendaInput = {
  viagemId: number
  itens: ItemVendaInput[]
}

export async function criarVendaService(data: VendaInput) {
  const { viagemId, itens } = data

  const produtos = await Promise.all(
    itens.map(item =>
      prisma.produto.findUnique({
        where: { id: item.produtoId },
      })
    )
  )

  const itensValidados = produtos.map((produto, index) => {
    if (!produto) throw new Error("Produto não encontrado")

    const qtdSolicitada = itens[index].quantidade
    if (produto.quantidade < qtdSolicitada) {
      throw new Error(`Estoque insuficiente para o produto "${produto.nome}". Disponível: ${produto.quantidade}, Solicitado: ${qtdSolicitada}`)
    }

    return {
      produtoId: produto.id,
      quantidade: qtdSolicitada,
      precoUnit: produto.precoVenda,
    }
  })

  // Atualiza o estoque
  await Promise.all(
    itens.map(item =>
      prisma.produto.update({
        where: { id: item.produtoId },
        data: {
          quantidade: {
            decrement: item.quantidade
          }
        }
      })
    )
  )

  return prisma.venda.create({
    data: {
      viagemId,
      itens: {
        create: itensValidados,
      },
    },
    include: {
      itens: true,
    },
  })
}


export async function listarVendasService() {
  return prisma.venda.findMany({
    include: {
      itens: {
        include: { produto: true },
      },
      viagem: true,
    },
    orderBy: { data: "desc" },
  })
}

export async function getRelatorioVendasService() {
  const vendas = await prisma.venda.findMany({
    include: {
      itens: {
        include: { produto: true }
      }
    }
  })

  let totalVendas = 0
  let totalLucro = 0
  let totalItensVendidos = 0
  const produtosMaisVendidos: Record<string, number> = {}
  const vendasPorData: Record<string, number> = {}

  for (const venda of vendas) {
    const data = venda.data.toISOString().split("T")[0]
    for (const item of venda.itens) {
      const qtd = item.quantidade
      const preco = item.produto.precoVenda
      const custo = item.produto.precoCompra
      const nome = item.produto.nome

      totalVendas += qtd * preco
      totalLucro += qtd * (preco - custo)
      totalItensVendidos += qtd

      produtosMaisVendidos[nome] = (produtosMaisVendidos[nome] || 0) + qtd
      vendasPorData[data] = (vendasPorData[data] || 0) + qtd * preco
    }
  }

  const produtosOrdenados = Object.entries(produtosMaisVendidos)
    .sort((a, b) => b[1] - a[1])
    .map(([nome, qtd]) => ({ nome, quantidade: qtd }))

  return {
    totalVendas,
    totalLucro,
    totalItensVendidos,
    produtosMaisVendidos: produtosOrdenados,
    vendasPorData
  }
}

export async function getProdutosMaisVendidosService() {
  const vendas = await prisma.venda.findMany({
    include: {
      itens: {
        include: { produto: true }
      }
    }
  })

  const produtosVendidos: Record<string, number> = {}

  for (const venda of vendas) {
    for (const item of venda.itens) {
      const nome = item.produto.nome
      const qtd = item.quantidade
      produtosVendidos[nome] = (produtosVendidos[nome] || 0) + qtd
    }
  }

  return Object.entries(produtosVendidos)
    .sort((a, b) => b[1] - a[1])
    .map(([nome, quantidade]) => ({ nome, quantidade }))
}

export async function filtrarVendasService(params: {
  dataInicial?: string
  dataFinal?: string
  produtoId?: string
  viagemId?: string
}) {
  const { dataInicial, dataFinal, produtoId, viagemId } = params

  const where: any = {}

  if (dataInicial || dataFinal) {
    where.data = {}
    if (dataInicial) where.data.gte = new Date(dataInicial)
    if (dataFinal) where.data.lte = new Date(dataFinal)
  }

  if (viagemId) {
    where.viagemId = Number(viagemId)
  }

  if (produtoId) {
    where.itens = {
      some: {
        produtoId: Number(produtoId)
      }
    }
  }

  return prisma.venda.findMany({
    where,
    include: {
      itens: {
        include: { produto: true }
      },
      viagem: true
    },
    orderBy: { data: "desc" }
  })
}


