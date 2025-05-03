const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authenticateToken = (req, res, next) => {

  let token = req.cookies.accessToken;
  

  if (!token && req.headers['Authorization']) {
    token = req.headers['Authorization'] && req.headers['Authorization'].split(' ')[1];  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token verification error:', err.message);
      return next('verifyRefreshToken');
    }

    req.user = decoded;
    
    return res.status(200).json({ message: 'Authenticated'});
  });
};

module.exports = authenticateToken ;
