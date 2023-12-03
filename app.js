const express = require ('express');
const tourRouter = require ('./routes/tourRoutes');
const globalErrorHandler = require ('./controllers/errorController');
const AppError = require ('./utils/AppError');

const app = express ();

app.use ('/api/v1/tours', tourRouter);

app.all ('*', (req, res, next) => { 
    throw new AppError ('Route was not found', 404)
});

app.use (globalErrorHandler);

module.exports = app;