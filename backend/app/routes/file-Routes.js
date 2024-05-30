const express = require('express')
const {checkSchema} = require('express-validator')

const fileRouter = express.Router()

//middlewares
const authenticateUser = require('../middlewares/auth')
const upload = require('../middlewares/multer')

//controllers
const filesCtrl = require('../controllers/files-controller')

//validations
const fileValidationSchema = require('../validators/file-validations')
const sharedFileValidationSchema = require('../validators/sharedFile-validations')

//File Uploads route
fileRouter.post('/upload', authenticateUser, upload.single('file'), checkSchema(fileValidationSchema),filesCtrl.upload)

//Get All the users file
fileRouter.get('/myFiles',authenticateUser,filesCtrl.getMyFiles)

//view file
fileRouter.get('/view/:fileId',authenticateUser,filesCtrl.viewFile)

//share file
fileRouter.post('/share',authenticateUser,checkSchema(sharedFileValidationSchema),filesCtrl.shareFile)

//Get all the shared files
fileRouter.get('/sharedFiles',authenticateUser,filesCtrl.getSharedFiles)

//get one shared file
fileRouter.get('/oneFile/:id',authenticateUser,filesCtrl.oneSharedFile)


module.exports = fileRouter