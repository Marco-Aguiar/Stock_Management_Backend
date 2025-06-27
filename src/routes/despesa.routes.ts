import { Router } from "express"
import { criarDespesa, getRelatorioDespesas, listarDespesas } from "../controllers/despesa.controller"

const router = Router()

router.post("/", criarDespesa)
router.get("/", listarDespesas)
router.get("/relatorio", getRelatorioDespesas)


export default router
