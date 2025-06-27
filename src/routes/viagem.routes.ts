import { Router } from "express"
import {
  criarViagem,
  listarViagens,
  calcularBalancoViagem,
  getBalancoGeral
} from "../controllers/viagem.controller"

const router = Router()

router.post("/", criarViagem)
router.get("/", listarViagens)
router.get("/:id/balanco", calcularBalancoViagem)
router.get("/balanco-geral", getBalancoGeral)

export default router
