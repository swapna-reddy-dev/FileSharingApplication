const { Schema , model } = require('mongoose')

const sharedFilesSchema= new Schema({
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },
    sharedWith: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    accessExpiry: Date
},{timestamps:true})

const SharedFile = model('SharedFile',sharedFilesSchema)

module.exports = SharedFile