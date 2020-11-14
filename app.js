const express = require('express');
const bodyParser = require('body-parser');

// routes
const feedRoutes = require('./routes/feed');

const app = express();

// middleware -- req body
// app.use(bodyParser.urlencoded()); --> for data type: x-www-form-urlencoded
app.use(bodyParser.json()); // for data type: application/json

// middleware -- headers
app.use((req, res, next) => {
  // add new headers except json() function default headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// middleware -- routes
// * forward any incoming requests that starts with ( /feed ) to the ( feeRoutes ) to handle them
app.use('/feed', feedRoutes);

const port = process.env.PORT || 8080;
app.listen(port);
