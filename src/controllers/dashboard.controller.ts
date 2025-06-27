import { RequestHandler } from "express"
import { getDashboardService } from "../services/dashboard.service"

export const getDashboard: RequestHandler = async (_req, res): Promise<void> => {
  try {
    const dados = await getDashboardService()
    res.status(200).json(dados)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao gerar dados do dashboard" })
  }
}
