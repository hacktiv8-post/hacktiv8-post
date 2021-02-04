const errorHandler = (error, req, res, next) => {
    
    let errorMessages = []
    let errorMessage = ''
    let errorCode = 0
    switch (error.name) {
        case 'SequelizeValidationError':
            errorMessages = error.errors.map(e => {
                return e.message
            })
            res.status(400).json({
                messages: errorMessages
            })
            break
        case 'SequelizeUniqueConstraintError':
            errorMessages = error.errors.map(e => {
                return e.message
            })
            res.status(400).json({
                messages: errorMessages
            })
            break;
        case 'Custom error':
            errorMessage = error.message
            errorCode = error.code
            res.status(errorCode).json({
                message: errorMessage
            })
            
    }

}

module.exports = { errorHandler }