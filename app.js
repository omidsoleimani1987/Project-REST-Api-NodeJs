const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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

// port
const port = process.env.PORT || 8080;

// connecting to DB
mongoose
  .connect(
    'mongodb+srv://omidsoleimani:Registered1366@cluster0.4eqhs.mongodb.net/NodeJs-Api?retryWrites=true&w=majority'
  )
  .then(result => {
    app.listen(port);
  })
  .catch(err => {
    console.log(err);
  });
