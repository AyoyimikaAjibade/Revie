/**
 * Creating an error class so as to pass it down the
 * global error handling function and only handling majorlys
 * error that we predict will occur i.e isOperational errors
 * as against Programming Errors
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
