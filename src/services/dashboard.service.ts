import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getDashboardService() {
  const vendas = await prisma.venda.findMany({
    include: {
      itens: {
        include: { produto: true }
      },
      viagem: true
    }
  })

  const despesas = await prisma.despesa.findMany()
  const produtos = await prisma.produto.findMany()

  let totalVendas = 0
  let totalLucro = 0
  const produtosVendidos: Record<string, number> = {}
  const receitaPorViagem: Record<number, number> = {}

  for (const venda of vendas) {
    let totalVenda = 0
    for (const item of venda.itens) {
      const qtd = item.quantidade
      const preco = item.produto.precoVenda
      const custo = item.produto.precoCompra
      const nome = item.produto.nome

      totalVenda += qtd * preco
      totalLucro += qtd * (preco - custo)

      produtosVendidos[nome] = (produtosVendidos[nome] || 0) + qtd
    }

    totalVendas += totalVenda
    receitaPorViagem[venda.viagemId] = (receitaPorViagem[venda.viagemId] || 0) + totalVenda
  }

  const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0)
  const totalComprasProdutos = produtos.reduce(
    (acc, p) => acc + p.quantidade * p.precoCompra,
    0
  )

  const topProdutosMaisVendidos = Object.entries(produtosVendidos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nome, quantidade]) => ({ nome, quantidade }))

  const viagemMaisRentavel = Object.entries(receitaPorViagem)
    .sort((a, b) => b[1] - a[1])[0]

  return {
    totalVendas,
    totalLucro,
    totalDespesas,
    lucroLiquido: totalLucro - totalDespesas - totalComprasProdutos,
    topProdutosMaisVendidos,
    viagemMaisRentavel: viagemMaisRentavel
      ? { viagemId: Number(viagemMaisRentavel[0]), receita: viagemMaisRentavel[1] }
      : null
  }
}
