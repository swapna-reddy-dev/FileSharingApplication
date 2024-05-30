const { Schema , model } = require('mongoose')

const sharedFilesSchema= new Schema({
    fileId: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    sharedWithUserId: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }],
    accessExpiry: {
        type: Date,
        default: null
    }
},{timestamps:true})

const SharedFile = model('SharedFile',sharedFilesSchema)

module.exports = SharedFile