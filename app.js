const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const app = express();

// 1)GLOBAL  MIDDLEWARES
/**
 * a middleware to log out request informations on the terminal with
 *  info like requested route, size of response, time to get response e.t.c
 */

//Set Security HTTP headers
// app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// a middleware Body parser to add and have access to the request body
app.use(express.json({ limit: '20kb' }));

// 3) ROUTE

// Mount routers
app.use('/api/v1/users', userRouter);

/**
 * EXPLANATION OF UNHANDLED ROUTES HANDLERS
 * if in our request response cycle our request was not satisfied
 * in the previous route handlers e.g 'tourRouter' then the request
 * hits this middleware and it get the said error message.
 */
app.all('*', (req, res, next) => {
  // 1) Directly sending the error message here
  // res.status(404).json({
  //   status: 'Not Found',
  //   message: `Can't find ${req.originalUrl} on this server`
  // });

  // 2) Passing the error to the global error handlers and creating an error
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // 3) Using the Error class and passing the error to the global error handler
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/**
 * GLOBAL ERROR HANDLING MIDDLEWARE
 */
app.use(globalErrorHandler);

module.exports = app;
