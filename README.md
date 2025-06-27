# Stock_Management_Backend



npx prisma studio
para ver o banco de dados



📦 Produtos

➕ Criar Produto
POST http://localhost:3000/produtos
Content-Type: application/json
Body (JSON):

{
  "nome": "Camiseta",
  "categoria": "Roupas",
  "precoCompra": 20,
  "margemLucro": 0.5,
  "precoVenda": 30,
  "quantidade": 100
}




🚚 Viagens

➕ Criar Viagem
POST http://localhost:3000/viagens
Content-Type: application/json
Body (JSON):

{
  "destino": "São Paulo",
  "motorista": "João da Silva",
  "dataSaida": "2025-06-22T08:00:00.000Z",
  "dataRetorno": "2025-06-25T20:00:00.000Z"
}



🧾 Vendas

➕ Criar Venda
POST http://localhost:3000/vendas
Content-Type: application/json
Body (JSON):

{
  "viagemId": 1,
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 2
    },
    {
      "produtoId": 2,
      "quantidade": 1
    }
  ]
}


🧾 Despesas

➕ Criar despesa
POST http://localhost:3000/despesas
Content-Type: application/json
Body (JSON):

{
  "tipo": "Combustível",
  "valor": 150.75,
  "viagemId": 1
}
