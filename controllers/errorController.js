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