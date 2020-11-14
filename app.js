const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// routes handlers
const feedRoutes = require('./routes/feed');

const app = express();

// multer and file upload handling
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // call this function when definition of destination is finished
    callback(null, 'images'); // null means no errors
  },
  filename: (req, file, callback) => {
    // On Windows, the file name that includes a date string is not really supported and will lead to some strange CORS errors.
    callback(null, uuidv4());
  }
});
// filtering the uploaded files
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// middleware -- request body parser
// app.use(bodyParser.urlencoded()); --> for data type: x-www-form-urlencoded
app.use(bodyParser.json()); // for data type: application/json

// adding the multer middleware
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

// serving the images statically
app.use('/images', express.static(path.join(__dirname, 'images')));

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

// error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});

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
