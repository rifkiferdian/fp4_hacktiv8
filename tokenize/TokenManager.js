require('dotenv').config();
const jwt = require('jsonwebtoken');
const TokenManager = {
  generateAccessToken: (email, password) => {
    return jwt.sign({email, password}, process.env.APP_KEY, {
        expiresIn: 60 * 60 * 1000,
      }
    )
  },
  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, process.env.APP_KEY);
    } catch (e) {
      console.error(e.message);
      return undefined;
    }
  } 
}

module.exports = TokenManager;