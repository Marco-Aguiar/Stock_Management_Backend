import { RequestHandler } from "express"
import {
  criarDespesaService,
  getRelatorioDespesasService,
  listarDespesasService,
} from "../services/despesa.service"

export const criarDespesa: RequestHandler = async (req, res) => {
  try {
    const despesa = await criarDespesaService(req.body)
    res.status(201).json(despesa)
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Erro ao criar despesa" })
  }
}

export const listarDespesas: RequestHandler = async (_req, res) => {
  try {
    const despesas = await listarDespesasService()
    res.status(200).json(despesas)
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar despesas" })
  }
}

export const getRelatorioDespesas: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { viagemId } = req.query
    const relatorio = await getRelatorioDespesasService(viagemId as string)
    res.status(200).json(relatorio)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao gerar relatório de despesas" })
  }
}
