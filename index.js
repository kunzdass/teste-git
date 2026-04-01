const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

// middlewares de parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
  res.send('Olá Mundo!')
})

// app.get('/usuario/:nome', (req, res) => {
//   res.json({ mensagem: `Olá, bem-vindo ${req.params.nome}!` })
// })

// app.get('/soma/:numeroUm/:numeroDois', (req, res) => {
//   const numeroUm = Number(req.params.numeroUm)
//   const numeroDois = parseInt(req.params.numeroDois)
//   const soma = numeroUm + numeroDois
//   return res.json({ soma: soma })
// })

// http://localhost:3000/produtos?codigo=1
// app.get('/produto', (req, res) => {
//   return res.json(req.query)
// })

const produtos = [
  { codigo: 1, nome: 'Arroz', preco: 19.90 },
  { codigo: 2, nome: 'Feijao', preco: 29.90 },
  { codigo: 3, nome: 'Carne', preco: 899999.90 },
]

// uma rota pra retornar todos os produtos cadastrados
app.get('/produtos', (req, res) => {
  return res.json({
    total: produtos.length,
    produtos: produtos
  })
})

// uma rota para retornar o cadastro de um produto, com base
// no ID informado por parametro na rota
// --> :id -> produtos.find()
app.get('/produtos/:id', (req, res) => {
  const produto = produtos.find(el => el.codigo == req.params.id)
  if (!produto) {
    return res.status(404).json({
      message: `Produto com ID ${req.params.id} não foi encontrado`
    })
  }
  return res.status(200).json(produto)
})

// para cadastrar um novo produto, utiliza-se o method POST.
app.post('/produtos', (req, res) => {
  // validacao de campos para cadastro
  if (!req.body.nome || !req.body.preco) {
    return res.status(400).json({
      message: 'Faltando campos obrigatórios: nome, preco'
    })
  }

  // logica de obtencao de ID
  const codigo = Math.max(...produtos.map(el => el.codigo)) + 1

  // cria o objeto do novo registro
  const novoProduto = {
    codigo: codigo,
    nome: req.body.nome,
    preco: req.body.preco
  }

  // "cadastra" o registro na listagem de produtos
  produtos.push(novoProduto)

  // retorno positivo para o cadastro bem-sucedido
  return res.status(201).json({
    message: 'Produto cadastrado com sucesso',
    data: novoProduto
  })
})

// atualizar um registro parcialmente]
app.patch('/produtos/:id', (req, res) => {
  const produto = produtos.find(el => el.codigo == req.params.id)
  if (!produto) {
    return res.status(404).json({
      message: `Produto com ID ${req.params.id} não foi encontrado para ser atualizado`
    })
  }

  if (!Object.hasOwn(req.body, 'nome') && !Object.hasOwn(req.body, 'preco')) {
    return res.status(400).json({
      message: 'Informe ao menos um campo para atualizar: nome ou preço'
    })
  }

  if (Object.hasOwn(req.body, 'nome')) {
    produto.nome = req.body.nome
  }

  if (Object.hasOwn(req.body, 'preco')) {
    produto.preco = req.body.preco
  }

  return res.status(200).json({
    message: 'Produto atualizado com sucesso',
    data: produto
  })
})

app.delete('/produtos/:id', (req, res) => {
  const indexProduto = produtos.findIndex(el => el.codigo == req.params.id)
  if (!indexProduto || indexProduto === -1) {
    return res.status(404).json({
      message: `Produto com ID ${req.params.id} não foi encontrado para ser deletado`
    })
  }

  produtos.splice(indexProduto, 1)
  res.status(204).send()
})

// function encontraProdutoPorCodigo (codigo) {
//   for (let index = 0; index < produtos.length; index++) {
//     if (produtos[index].codigo == codigo) {
//       return produtos[index];
//     }
//   }
// }

// app.get('/produtos-caros', function (req, res) {
//   return res.json(produtos.filter(function (el) {
//     return el.preco >= 20
//   }))
// })

// function encontraProdutosCaros () {
//   const produtosCaros = []
//   for (let index = 0; index < produtos.length; index++) {
//     if (produtos[index].preco >= 20) {
//       produtosCaros.push(produtos[index])
//     }
//   }
//   return produtosCaros
// }

app.listen(port, () => {
  console.log(`App de exemplo rodando na porta ${port}`)
})