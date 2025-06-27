import { Router } from "express"
import { criarProduto, listarProdutos } from "../controllers/produto.controller"

const router = Router()

router.post("/", criarProduto)
router.get("/", listarProdutos)

export default router
