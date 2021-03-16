/**
 * @file This file handles all API errors and Creating an error class so as to pass it down the
 * global error handling function and only handling majorlys error that we predict will occur
 * i.e isOperational errors as against Programming Errors
 * @author Ayoyimika <ajibadeayoyimika@gmail.com> <16/03/2021 08:32pm>
 * @since 1.0.0
 * Last Modified: Ayoyimika <ajibadeayoyimika@gmail.com> <02/01/2021 06:59am>
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // making sure function call i.e 'this.constructor'
    //doesnot apper in the stacktrace and does not pollute it
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
