const express = require('exprress')
const cors = require('cors')
const app = express()
const ClienteRoutes = require('./routes/ClienteRoutes')

//Configuração de respota do JSON
app.use(express.json())
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

app.use(express.static('public'))

/* Habilitar uso de rotas pelo express */
app.use('/clientes',ClienteRoutes)

app.listen(5000)