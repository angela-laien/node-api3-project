const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter.js');

const server = express();

// middleware
server.use(logger);
server.use(helmet());
server.use(morgan("dev"));
// built-in middleware
server.use(express.json());
//endpoints
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";
  res.send(
    `<h2>Let's write some middleware!</h2>
    <p>Welcome${nameInsert} to the API</p>
    `);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} Request to ${req.originalUrl}`);

  next();
}

module.exports = server;
