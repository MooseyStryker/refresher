const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parse')

const { environment } = require('./congi')
const isProduction = environment === 'production'

const app = express();


app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());


if (!isProduction) {
    app.use(cors());
};

app.use(
    helmet.crossOriginResourcePolicy({
        policy: 'cross-origin'
    })
);

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
)
