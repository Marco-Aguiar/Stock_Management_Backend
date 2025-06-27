import { Request, Response } from "express"
import { criarUsuarioService, buscarUsuarioPorEmailService } from "../services/usuario.service"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const JWT_SECRET = process.env.JWT_SECRET || "segredo"

export const cadastrarUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, senha } = req.body
    const hash = await bcrypt.hash(senha, 10)
    const user = await criarUsuarioService({ nome, email, senha: hash })
    res.status(201).json({ id: user.id, email: user.email })
  } catch (error:any) {
    console.error(error)
    res.status(400).json({ message: error.message || "Erro ao cadastrar usuário" })
  }
}

export const loginUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = req.body
    const user = await buscarUsuarioPorEmailService(email)
    if (!user) {
      res.status(401).json({ message: "Email ou senha inválidos" })
      return
    }
    const match = await bcrypt.compare(senha, user.senha)
    if (!match) {
      res.status(401).json({ message: "Email ou senha inválidos" })
      return
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "8h" })
    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao autenticar usuário" })
  }
}
