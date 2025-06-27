import { Request, Response } from "express"
import {
  criarProdutoService,
  listarProdutosService,
} from "../services/produto.service"

export const criarProduto = async (req: Request, res: Response) => {
  try {
    const produto = await criarProdutoService(req.body)
    res.status(201).json(produto)
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar produto", error })
  }
}

export const listarProdutos = async (_req: Request, res: Response) => {
  try {
    const produtos = await listarProdutosService()
    res.status(200).json(produtos)
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar produtos", error })
  }
}
