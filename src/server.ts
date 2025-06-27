import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes"
import produtoRoutes from "./routes/produto.routes"
import viagemRoutes from "./routes/viagem.routes"
import vendaRoutes from "./routes/venda.routes"
import despesaRoutes from "./routes/despesa.routes"
import dashboardRoutes from "./routes/dashboard.routes"
import usuarioRoutes from "./routes/usuario.routes"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/produtos", produtoRoutes)
app.use("/vendas", vendaRoutes)
app.use("/despesas", despesaRoutes)
app.use("/viagens", viagemRoutes) 
app.use("/dashboard", dashboardRoutes)
app.use("/usuarios", usuarioRoutes)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
