const express = require('express')

const userRouter = express.Router()

//middlewares
const authenticateUser = require('../middlewares/auth')
const {checkSchema} = require('express-validator')

//controllers
const usersCltr = require('../controllers/users-controller')

//validations
const {userRegisterValidationSchema, userLoginValidationSchema} = require('../validators/user-validations')

//User Register
userRouter.post('/register',checkSchema(userRegisterValidationSchema),usersCltr.register)

//User Login
userRouter.post('/login',checkSchema(userLoginValidationSchema), usersCltr.login)

//User Account 
userRouter.get('/account',authenticateUser,usersCltr.account)

module.exports = userRouter

