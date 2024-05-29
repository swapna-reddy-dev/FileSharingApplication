const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

//application level middlewares
app.use(express.json())
app.use(cors())

//Database configuration
const configDB = require('./config/db')
configDB()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port,() => {
    console.log(`server is successfully running on port ${port}`)
})