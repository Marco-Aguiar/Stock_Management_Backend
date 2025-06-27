import { Request, Response, RequestHandler } from "express"
import {
  criarVendaService,
  listarVendasService,
  getRelatorioVendasService,
  getProdutosMaisVendidosService,
  filtrarVendasService,
} from "../services/venda.service"

export const criarVenda: RequestHandler = async (req, res): Promise<void> => {
  try {
    const venda = await criarVendaService(req.body)
    res.status(201).json(venda)
  } catch (error) {
    res.status(400).json({ message: (error as Error).message })
  }
}

export const listarVendas: RequestHandler = async (_req, res): Promise<void> => {
  try {
    const vendas = await listarVendasService()
    res.status(200).json(vendas)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao listar vendas" })
  }
}

export const getRelatorioVendas: RequestHandler = async (_req, res): Promise<void> => {
  try {
    const relatorio = await getRelatorioVendasService()
    res.status(200).json(relatorio)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao gerar relatório de vendas" })
  }
}

export const getProdutosMaisVendidos: RequestHandler = async (_req, res): Promise<void> => {
  try {
    const produtos = await getProdutosMaisVendidosService()
    res.status(200).json(produtos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao buscar produtos mais vendidos" })
  }
}

export const filtrarVendas: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { dataInicial, dataFinal, produtoId, viagemId } = req.query
    const vendas = await filtrarVendasService({
      dataInicial: dataInicial as string,
      dataFinal: dataFinal as string,
      produtoId: produtoId as string,
      viagemId: viagemId as string
    })
    res.status(200).json(vendas)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao filtrar vendas" })
  }
}
