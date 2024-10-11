const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize')

const { environment } = require('./config')
const isProduction = environment === 'production'

const app = express();


app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// Pre-request middleware
// This is the security Middleware
if (!isProduction) {
    // Enables CORS only in development
    app.use(cors());
};


app.use(
    // Helmet helps set a variety of headers to better secure the app
    helmet.crossOriginResourcePolicy({
        policy: 'cross-origin'
    })
);

// Set the csurf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
)
// End of pre-request middleware

const routes = require('./routes')


app.use(routes)


// Catch unhandled requests and forward to this error handler
app.use((_req, _res, next) => {
    const err = new Error("The Requested resource couldn't be found.")
    err.title = "Resource Not Found"
    err.errors = {
        message: "The requested resource couldn't be found."
    }
    err.status = 404
    next(err)
})

// Process sequelie errors
app.use((err, _req, _res, next) => {
    // Check if error is a Sequelize error
    if (err instanceof ValidationError) {
        let errors = {};
        for (let error of errors){
            error[error.path] = error.message
        }
        err.title = 'Validation error'
        err.errors = errors
    }
    next(err)
})


// Error formatting
app.use((err, _req, res, _next) => {
    res.status(err.status || 500)
    console.error(err)
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    })
})





module.exports = app;
