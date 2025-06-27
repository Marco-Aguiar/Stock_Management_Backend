import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function criarProdutoService(data: {
  nome: string
  categoria?: string
  precoCompra: number
  margemLucro: number
  quantidade: number
}) {
  const precoVenda = data.precoCompra * (1 + data.margemLucro / 100)
  const custoTotal = data.precoCompra * data.quantidade

  const produto = await prisma.produto.create({
    data: {
      nome: data.nome,
      categoria: data.categoria,
      precoCompra: data.precoCompra,
      margemLucro: data.margemLucro,
      precoVenda,
      quantidade: data.quantidade,
    },
  })

  await prisma.transacao.create({
    data: {
      tipo: "saida",
      valor: custoTotal,
      descricao: `Compra de ${data.quantidade}x ${data.nome}`,
    },
  })

  return produto
}


export async function listarProdutosService() {
  const produtos = await prisma.produto.findMany()
  return produtos
}
