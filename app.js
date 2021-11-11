const express = require('express');
const app = express();
const userRouter = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const pug = require('pug');
const path = require('path');

// middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(mongoSanitize());
app.use(xss());

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/users', userRouter);


app.all('*', (req, res, next) => {
    res.status(400).json({
        status: 'success',
        message: 'Page not found 404'
    });
});

module.exports = app;