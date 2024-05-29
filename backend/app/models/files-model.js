const { Schema , model } = require('mongoose')

const filesSchema = new Schema({
    owner: { 
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    filename: String,
    filePath: String
},{timestamps:true});

const File = model('File', filesSchema)

module.exports = File
