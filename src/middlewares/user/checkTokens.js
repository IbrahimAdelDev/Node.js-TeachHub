const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const checkRefreshToken = require('./checkRefreshToken');
// const User = require('../../models/User');
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authenticateToken = (req, res, next) => {

  let token = req.cookies.accessToken;
  

  if (!token && req.headers['Authorization']) {
    token = req.headers['Authorization'] && req.headers['Authorization'].split(' ')[1];  }

  if (!token) {
    return checkRefreshToken(req, res, next); // Call the refresh token middleware if no access token is found
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return checkRefreshToken(req, res, next); // Call the refresh token middleware if access token verification fails
    }

    req.userId = decoded.userId;
    return next();
  });
};

module.exports = authenticateToken ;
