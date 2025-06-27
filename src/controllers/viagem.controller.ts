import { Request, Response } from "express"
import {
  criarViagemService,
  listarViagensService,
  calcularBalancoViagemService,
  getBalancoGeralService
} from "../services/viagem.service"

export const criarViagem = async (req: Request, res: Response): Promise<void> => {
  try {
    const viagem = await criarViagemService(req.body)
    res.status(201).json(viagem)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao criar viagem" })
  }
}

export const listarViagens = async (_req: Request, res: Response): Promise<void> => {
  try {
    const viagens = await listarViagensService()
    res.status(200).json(viagens)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao listar viagens" })
  }
}

export const calcularBalancoViagem = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const balanco = await calcularBalancoViagemService(id)
    res.status(200).json(balanco)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao calcular balanço da viagem" })
  }
}

export const getBalancoGeral = async (_req: Request, res: Response): Promise<void> => {
  try {
    const balanco = await getBalancoGeralService()
    res.status(200).json(balanco)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao calcular balanço geral" })
  }
}
