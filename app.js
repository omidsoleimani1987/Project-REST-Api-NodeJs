const express = require('express');
const bodyParser = require('body-parser');

// routes
const feedRoutes = require('./routes/feed');

const app = express();

// middleware -- req body
// app.use(bodyParser.urlencoded()); --> for data type: x-www-form-urlencoded
app.use(bodyParser.json()); // for data type: application/json

// middleware -- routes

// ** forward any incoming requests that starts with ( /feed ) to the ( feeRoutes ) to handle them
app.use('/feed', feedRoutes);

app.listen(8080);
