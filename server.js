const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
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
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.log(` DATABASE CONNECTION ERROR: ${err}`);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  //console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
