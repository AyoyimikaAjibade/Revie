/**
 * @file Defines the basic configuration of Mongoose ORM @see {@link https://mongoosejs.com} connection to
 *  MONGODB database. Then it exports the config as module. while listening the some event been emitted like
 * 'uncaughtException' for generic error handling and exit of the process
 * @author Ayoyimika <ajibadeayoyimika@gmail.com> <03/16/2021 08:32pm>
 * @since 1.0.0
 *  Last Modified: Ayoyimika <ajibadeayoyimika@gmail.com> <03/16/2021 08:32pm>
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// log error to the console for debugging purpose
process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('UNCAUGHT EXCEPTION! 💥Shutting down...');
  console.log(err.name, err.message);
});

/**
 * this command will read our variable in our config.env file
 * and save them into node JS environments variable
 */
dotenv.config({ path: './config.env' });

const app = require('./app');
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// initialize mongodb connection with mongoose
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false, // fix findOneAndUpdate() deprecation warning
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.log(` DATABASE CONNECTION ERROR: ${err}`);
  });

// Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// log error to the console for debugging purpose
process.on('unhandledRejection', (err) => {
  console.log(err);
  //console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
