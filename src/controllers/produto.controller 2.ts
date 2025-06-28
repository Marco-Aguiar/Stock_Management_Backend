// src/controllers/ProdutoController.ts
import { Request, Response } from "express"
import {
  criarProdutoService,
  listarProdutosService,
  atualizarQuantidadeProdutoService,
  getRelatorioInventarioService, // Importe a nova função
} from "../services/produto.service"

export const criarProduto = async (req: Request, res: Response) => {
  try {
    const produto = await criarProdutoService(req.body)
    res.status(201).json(produto)
  } catch (error) {
    console.error("Erro ao criar produto:", error); 
    res.status(500).json({ message: "Erro ao criar produto", error })
  }
}

export const listarProdutos = async (_req: Request, res: Response) => {
  try {
    const produtos = await listarProdutosService()
    res.status(200).json(produtos)
  } catch (error) {
    console.error("Erro ao listar produtos:", error); 
    res.status(500).json({ message: "Erro ao listar produtos", error })
  }
}

export const atualizarQuantidadeProduto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantidade } = req.body; // A nova quantidade total

  if (typeof quantidade !== 'number' || quantidade < 0) {
    return res.status(400).json({ message: "Quantidade inválida fornecida." });
  }

  try {
    const produtoAtualizado = await atualizarQuantidadeProdutoService(Number(id), quantidade);
    res.status(200).json(produtoAtualizado);
  } catch (error: any) {
    console.error(`Erro ao atualizar quantidade do produto ${id}:`, error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return res.status(404).json({ message: "Produto não encontrado." });
    }
    res.status(500).json({ message: "Erro ao atualizar quantidade do produto.", error: error.message });
  }
};

export const getRelatorioInventario = async (_req: Request, res: Response) => {
  try {
    const relatorio = await getRelatorioInventarioService();
    res.status(200).json(relatorio);
  } catch (error) {
    console.error("Erro ao gerar relatório de inventário:", error);
    res.status(500).json({ message: "Erro ao gerar relatório de inventário", error });
  }
}