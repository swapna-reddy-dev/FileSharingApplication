const { Schema , model } = require('mongoose')

const filesSchema = new Schema({
    owner: { 
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    fileName: String,
    filePath: String,
    humanFileSize: String,
    sharedWith: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
},{timestamps:true});

const File = model('File', filesSchema)

module.exports = File
