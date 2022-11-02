const jwt = require("jsonwebtoken");

const signToken = (object) => {
  return jwt.sign(object, "rahasiadong");
};

const verifyToken = (access_token) => {
  return jwt.verify(access_token, "rahasiadong");
};

module.exports = {
  signToken,
  verifyToken,
};