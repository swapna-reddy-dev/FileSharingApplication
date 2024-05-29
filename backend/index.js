require('dotenv').config()
const express = require('express')
const cors = require('cors')
const {checkSchema} = require('express-validator')
const app = express()
const port = 3001

const fileRouter = require('./app/routes/file-Routes')

//application level middlewares
app.use(express.json())
app.use(cors())

//Database configuration
const configDB = require('./config/db')
configDB()

//middlewares
const authenticateUser = require('./app/middlewares/auth')

//Requiring controllers
const usersCltr = require('./app/controllers/users-controller')


//Required Validation Schema
const {userRegisterValidationSchema, userLoginValidationSchema} = require('./app/validators/user-validations')



//Routes

//User Register
app.post('/api/users/register',checkSchema(userRegisterValidationSchema),usersCltr.register)

//User Login
app.post('/api/users/login',checkSchema(userLoginValidationSchema), usersCltr.login)

//User Account 
app.get('/api/users/account',authenticateUser,usersCltr.account)

//Files
app.use('/api/files',fileRouter)

app.listen(port,() => {
    console.log(`server is successfully running on port ${port}`)
})