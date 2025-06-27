import { Router } from "express"
import { cadastrarUsuario, loginUsuario } from "../controllers/usuario.controller"

const router = Router()

router.post("/", cadastrarUsuario)     // POST /usuarios
router.post("/login", loginUsuario)    // POST /usuarios/login

export default router
