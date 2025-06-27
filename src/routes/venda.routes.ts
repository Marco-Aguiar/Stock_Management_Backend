import { Router } from "express"
import {
  criarVenda,
  listarVendas,
  getRelatorioVendas,
  getProdutosMaisVendidos,
  filtrarVendas
} from "../controllers/venda.controller"

const router = Router()

router.post("/", criarVenda)
router.get("/", listarVendas)
router.get("/relatorio", getRelatorioVendas)
router.get("/produtos-mais-vendidos", getProdutosMaisVendidos)
router.get("/filtro", filtrarVendas)


export default router
