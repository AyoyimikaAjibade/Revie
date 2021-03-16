/**
 * @file recieves' the error from the app and functions, setting up the response
 * objects if the environments is developments and passing it down to the
 * global error handlers middleware for further processing
 * @author Ayoyimika <ajibadeayoyimika@gmail.com> <16/03/2021 1:37am>
 * @since 0.1.0
 * Last Modified: Ayoyimika <ajibadeayoyimika@gmail.com> <16/03/2021 1:37am>
 */

const AppError = require('./../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

//Defining our Global error handling middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
};
