const User = require('../models/users-model')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const {validationResult} = require('express-validator')
const { pick } = require('lodash')
const usersCltr = {}

usersCltr.register = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body = pick(req.body,['username','email','password'])
        const user = new User(body)
        const salt = await bcryptjs.genSalt()
        const encryptedPassword = await bcryptjs.hash(user.password,salt)
        user.password=encryptedPassword
        await user.save()
        res.status(201).json(user)
    } catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

usersCltr.login = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body = pick(req.body,['email','password'])
        const user = await User.findOne({email:body.email})
        if(!user){
            return res.status(404).json({errors:'Invalid email/password'})
        }
        const checkpassword = await bcryptjs.compare(body.password,user.password)
        if(!checkpassword){
            return res.status(404).json({errors:'Invalid email/password'})
        }
        const tokenData= {
            id:user._id,
            email:user.email,
            name: user.username
        }
        const token = jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:'14d'})
        res.json({'token': token})
    } catch(err){
        console.log(err)
        res.status(500).json({errors:'Internal Server Error'})
    }
}

usersCltr.account = async (req,res) => {
    try {
        const id = req.user.id
        const user = await User.findById({_id: id})
        if(!user) {
            return res.status(404).json({error: 'Record Not Found'})
        }
        const user1 = pick(user,['_id','username','email'])
        return res.status(201).json(user1)
    } catch(err){
        console.log(err)
        res.status(500).json({errors:'Internal Server Error'})
    }
}

usersCltr.getUsers = async (req,res) => {
    try{
        const users = await User.find()
        return res.status(201).json(users)
    } catch(err){
        console.log(err)
        res.status(500).json({errors:'Internal Server Error'})
    }
}

module.exports = usersCltr