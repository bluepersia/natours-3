require ('dotenv').config ({path: './config.env'});

const app = require ('./app');
const mongoose = require('mongoose');

mongoose.connect (process.env.DATABASE).then (conn => {
    console.log ('Mongoose connected');
})


const port = process.env.PORT || 3000;

app.listen (port, () => {
    console.log ('Server listening on port ', port);
})