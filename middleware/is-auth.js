const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // get the attached token to the request from attached headers
  const authHeader = req.get('Authorization');

  //check if we get such a header at all
  if (!authHeader) {
    const message = 'Not authenticated!';
    const error = new Error(message);
    error.statusCode = 401; // not authenticated
    throw error;
  }

  // if header is attached to request
  const token = authHeader.split(' ')[1];

  // try decode token and verify it
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, 'somesupersecretprivatekey');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const message = 'Not authenticated!';
    const error = new Error(message);
    error.statusCode = 401; // not authenticated
    throw error;
  }

  // if we have a valid token
  // we extract the userId which we stored in the token, and store it in request, that we can use it in other places that this request might go, like our routes
  req.userId = decodedToken.userId;
  next();
};
