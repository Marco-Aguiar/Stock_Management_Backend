import { Router } from "express"
import { criarProduto, listarProdutos } from "../controllers/produto.controller"
import { atualizarQuantidadeProduto, getRelatorioInventario } from "../controllers/produto.controller 2"

const router = Router()

router.post("/", criarProduto)
router.get("/", listarProdutos)
router.patch("/:id", atualizarQuantidadeProduto)
router.get("/relatorio-inventario", getRelatorioInventario) // GET /produtos/relatorio-inventario


export default router
