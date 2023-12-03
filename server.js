process.on ('uncaughtException', err => {
    console.log ('UNCAUGHT EXCEPTION');
    console.log (err);

    process.exit (1);
})


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


process.on ('unhandledRejection', function (err)
{
    console.log ('UNHANDLED REJECTION');
    console.log (err);

    server.close (() => {
        process.exit (1);
    })
});
