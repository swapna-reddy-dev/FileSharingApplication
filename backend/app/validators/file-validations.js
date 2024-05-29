const File = require('../models/files-model')

const fileValidationSchema = {
    fileName: {
        custom:{
            options: async function(value){
                const file = await File.findOne({fileName:value})
                if(!file){
                    return true
                }
                else{
                    throw new Error('File Name already exists')
                }
            }
        },
        trim:true
    }
}

module.exports = fileValidationSchema