const express = require ('express');
const morgan = require ('morgan');
const tourRouter = require ('./routes/tourRoutes');
const globalErrorHandler = require ('./controllers/errorController');
const AppError = require ('./utils/AppError');

const app = express ();

if (process.env.NODE_ENV == 'development')
    app.use (morgan('dev'));

app.use (express.json ());

app.use ('/api/v1/tours', tourRouter);

app.all ('*', (req, res, next) => { 
    throw new AppError ('Route was not found', 404)
});

app.use (globalErrorHandler);

module.exports = app;