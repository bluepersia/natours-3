const AppError = require ('../utils/AppError');

module.exports = (err, req, res, next) =>
{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV == 'production')
        sendProd (err, res);
    else if (process.env.NODE_ENV == 'development')
        sendDev (err, res);
}


function sendDev (err, res)
{
    res.status (err.statusCode).json ({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}

function sendProd (err, res)
{
    if (err.name == 'CastError')
        err = handleCastErrorDB (err);
    if (err.code == 11000)
        err = handleDuplicateErrorDB (err);
    if (err.name == 'ValidationError')
        err = handleValidationErrorDB (err);

    if (err.isOperational)
    {
        res.status (err.statusCode).json ({
            status: err.status,
            message: err.message
        })
    }
    else {
        res.status (500).json ({
            status: 'error',
            message: 'Something went very wrong.'
        })
    }
}

function handleCastErrorDB (err)
{
    return new AppError (`Invalid ${err.path}: ${err.value}`, 400);
}

function handleDuplicateErrorDB (err)
{
    return new AppError (`${Object.values(err.keyValue)[0]} has already been used.`, 400);
}

function handleValidationErrorDB (err)
{
    return new AppError (err.message, 400);
}