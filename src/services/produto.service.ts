// src/services/produto.service.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function criarProdutoService(data: {
  nome: string
  categoria?: string
  precoCompra: number
  margemLucro: number
  quantidade: number // Já inclui quantidade inicial
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

  // Registra a transação de "saída" (custo) na compra inicial do produto
  await prisma.transacao.create({
    data: {
      tipo: "saida",
      valor: custoTotal,
      descricao: `Compra inicial de ${data.quantidade}x ${data.nome}`,
      data: new Date() // Adiciona data explícita, caso não seja default 'now()' no frontend
    },
  })

  return produto
}

export async function listarProdutosService() {
  const produtos = await prisma.produto.findMany()
  return produtos
}

// --- Nova função para atualizar a quantidade do produto ---
export async function atualizarQuantidadeProdutoService(
  id: number,
  novaQuantidade: number // Esta é a quantidade FINAL que o produto deve ter
) {
  // Opcional: Adicionar validação se a novaQuantidade é válida (e.g., não negativa)
  if (novaQuantidade < 0) {
    throw new Error("A quantidade em estoque não pode ser negativa.")
  }

  // Você pode adicionar lógica aqui para registrar a entrada como uma Transação
  // Isso exigiria saber a quantidade ANTES da atualização para calcular a diferença
  // Por simplicidade, vamos focar primeiro apenas na atualização do estoque
  // e podemos adicionar a Transação de "entrada" depois, se for necessário para a contabilidade.

  const produtoAtualizado = await prisma.produto.update({
    where: { id },
    data: { quantidade: novaQuantidade },
  })

  return produtoAtualizado
}

export const getRelatorioInventarioService = async () => {
  const produtos = await prisma.produto.findMany({
    orderBy: {
      nome: 'asc' // Ordenar por nome para melhor visualização
    }
  });

  const relatorio = produtos.map(produto => {
    const valorTotalCompra = produto.quantidade * produto.precoCompra;
    const valorTotalVendaPotencial = produto.quantidade * produto.precoVenda;

    return {
      id: produto.id,
      nome: produto.nome,
      quantidadeAtual: produto.quantidade,
      precoCompra: produto.precoCompra,
      precoVenda: produto.precoVenda,
      valorTotalEmEstoqueCompra: valorTotalCompra,
      valorTotalEmEstoqueVendaPotencial: valorTotalVendaPotencial,
    };
  });

  // Opcional: Calcular totais gerais do inventário
  const totalGeralValorCompra = relatorio.reduce((acc, item) => acc + item.valorTotalEmEstoqueCompra, 0);
  const totalGeralValorVendaPotencial = relatorio.reduce((acc, item) => acc + item.valorTotalEmEstoqueVendaPotencial, 0);
  const totalItensEmEstoque = relatorio.reduce((acc, item) => acc + item.quantidadeAtual, 0);

  return {
    produtos: relatorio,
    totais: {
      totalGeralValorCompra,
      totalGeralValorVendaPotencial,
      totalItensEmEstoque,
    }
  };
};