require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3001

const fileRouter = require('./app/routes/file-Routes')
const userRouter = require('./app/routes/user-Routes')

//application level middlewares
app.use(express.json())
app.use(cors())

//Database configuration
const configDB = require('./config/db')
configDB()

//Requiring controllers
const usersCltr = require('./app/controllers/users-controller')


//Routes

//Users Routes
app.use('/api/users',userRouter)

//All users
app.get('/api/users',usersCltr.getUsers)

//Files Routes
app.use('/api/files',fileRouter)

app.listen(port,() => {
    console.log(`server is successfully running on port ${port}`)
})