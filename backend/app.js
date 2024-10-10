const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

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





module.exports = app;
