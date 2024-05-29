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
    },
    accessExpiry: {
        isDate: {
            errorMessage: 'The format of date must be yyyy-mm-dd'
        },
        custom:{
            options: async function(value){
                const expiryDate = new Date(value);
                const now = new Date();
                if (expiryDate <= now) {
                    throw new Error('Expiry date must be in the future');
                } else {
                    return true;
                }
            }
        },
    }

}

module.exports = sharedFileValidationSchema