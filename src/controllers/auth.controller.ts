// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export const login = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body

  if (email === "teste@teste.com" && password === "123456") {
    const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    })

    res.status(200).json({ token })
  } else {
    res.status(401).json({ message: "Invalid credentials" })
  }
}
