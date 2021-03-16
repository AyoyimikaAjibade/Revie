/**
 * @file Defines the basic configuration of the Express Framework @see {@link https://expressjs.com/} and Middleware for
 * data validation, sanitization, brute force attack and more. Then it exports the config as module.
 * Mounting the applications router per resources and configuring the global error handler and other error
 * handling middleware.
 * @author Ayoyimika <ajibadeayoyimika@gmail.com> <03/16/2021 08:32pm>
 * @since 1.0.0
 *  Last Modified: Gabriel <gabrielsonchia@gmail.com> <17/03/2021 06:59am>
 */

const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const docs = require('./routes/documentations');
const app = express();

//GLOBAL  MIDDLEWARES
/**
 * a middleware to log out request informations on the terminal with
 *  info like requested route, size of response, time to get response e.t.c
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Set Security HTTP headers
app.use(helmet());

/**
 * Reduce the number of request from a particular IP addresse for security purpose
 * It prevent denail of service and brute force attack
 */
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP. Please try again in an hour!',
});
app.use('/api', limiter);

// a middleware Body parser to add and have access to the request body
app.use(express.json({ limit: '20kb' }));

//Data sanitization against NOSQL query injection
app.use(mongoSanitize());

//Data sanitization against xss and malicious HTML code with javascript enbedded in it
app.use(xss());

/**
 * ROUTE: Mount routers
 * Adds application routes middleware from the documentations, userRoutes
 * and reviewRoutes index which groups all routes together
 */
app.use('/docs', docs);
app.use('/api/v1/users', userRouter);

/**
 * EXPLANATION OF UNHANDLED ROUTES HANDLERS
 * if in our request response cycle our request was not satisfied
 * in the previous route handlers e.g 'reviewRouter' then the request
 * hits this middleware and it get the said error message.
 */
app.all('*', (req, res, next) => {
  // 3) Using the Error class and passing the error to the global error handler
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/**
 * GLOBAL ERROR HANDLING MIDDLEWARE
 */
app.use(globalErrorHandler);

module.exports = app;
