const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const Client = require('pg').Client;
const PORT = 3001
require('dotenv').config()

// configuracao do PostgreSql
const pool = new Client({
   user: process.env.USER_NAME,
   password: process.env.DB_PASSWORD,
   host: process.env.HOST_NAME,
   database: process.env.DB_NAME,
   port: process.env.DB_NUMBER
})

// conexao do com banco de dados
pool.connect()
pool.query("select * from cliente")
   .then(res => console.log(res))

// Configuracao geral das paginas
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())


// cadastro de clientes
app.post('/clientes', async (req, res) => {
   try {
      const {nome, email, telefone, coordenada_x, coordenada_y} = req.body;
      const cliente = await pool.query(`INSERT INTO cliente(nome, email, telefone, coordenada_x, coordenada_y) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [nome, email, telefone, coordenada_x, coordenada_y]);
      console.log(cliente)

      res.status(200).json(cliente)
   } catch (error) {
      res.status(400).send(error)
   }
})

// Busca por todos os usuarios
app.get('/clientes', async (req, res) => {
   try {
      const cliente = await pool.query(`SELECT * FROM cliente`);

      res.status(200).json(cliente)
   } catch (error) {
      res.status(400).send(error)
   }
})

// Busca filtrada pelo id
app.get('/clientes/:id', async (req, res) => {
   try {
      const {id} = req.params
      const cliente = await pool.query(`SELECT * from cliente WHERE id = $1`, [id])

      res.status(200).json(cliente)
   } catch (error) {
      res.status(400).send(error)
   }
})

// Rota para calcular a rota otimizada
app.get('/calcular-ordem-visita', async (req, res) => {
   try {
      const clientes = await obterClientesDoBancoDeDados();
      const ordemVisita = otimizarOrdemVisita(clientes);

      res.json({
         ordemVisita,
      });
   } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Erro interno do servidor' });
   }
});

// Função para obter os clientes do banco de dados
async function obterClientesDoBancoDeDados() {
   const result = await pool.query('SELECT * FROM cliente');
   return result.rows;
}

// Função para calcular a ordem de visitação otimizada
function otimizarOrdemVisita(clientes) {
   // Ordenar os clientes da menor para a maior distância ao ponto (0, 0)
   clientes.sort((a, b) => {
      const distanciaA = a.coordenada_x ** 2 + a.coordenada_y ** 2;
      const distanciaB = b.coordenada_x ** 2 + b.coordenada_y ** 2;
      return distanciaA - distanciaB;
   });

   // Retornar a ordem de visitação
   return clientes.map(cliente => cliente.id);
}



// Servidor da aplicacao
app.listen(PORT, () => console.log(`Server Running... port: ${PORT}`))
