const sharedFileValidationSchema = {
    fileId: {
        notEmpty:{
            errorMessage: 'File Id is required'
        },
        isMongoId:{
            errorMessage: 'Should be a vaild mongoDb Id'
        }
    },
    sharedWithUserId: {
        notEmpty:{
            errorMessage: 'User id is required'
        },
        isMongoId:{
            errorMessage: 'Should be a vaild mongoDb Id'
        }
    }
}

module.exports = sharedFileValidationSchema