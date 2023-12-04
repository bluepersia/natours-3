const express = require ('express');
const morgan = require ('morgan');
const tourRouter = require ('./routes/tourRoutes');
const globalErrorHandler = require ('./controllers/errorController');
const AppError = require ('./utils/AppError');
const rateLimit = require ('express-rate-limit');
const helmet = require ('helmet');
const mongoSanitize = require ('mongo-sanitize');
const xss = require ('xss-clean');
const hpp = require ('hpp');

const app = express ();


app.use (helmet ());

app.use (hpp ({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'];
}));

app.use (mongoSanitize ());
app.use (xss());

if (process.env.NODE_ENV == 'development')
    app.use (morgan('dev'));

app.use (express.json ({limit: '10kb'}));

app.use (rateLimit ({
    max: 5,
    windowMs: 5000,
    message: 'Exceeding the rate limit'
}))

app.use ('/api/v1/tours', tourRouter);

app.all ('*', (req, res, next) => { 
    throw new AppError ('Route was not found', 404)
});

app.use (globalErrorHandler);

module.exports = app;