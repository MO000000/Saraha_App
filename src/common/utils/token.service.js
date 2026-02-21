import jwt from "jsonwebtoken";

export const GenerateToken = ({ payload, SECRET_KEY, options = {} } = {}) => {
  return jwt.sign(payload, SECRET_KEY, options);
};

export const VerifyToken = ({ token, SECRET_KEY, options = {} } = {}) => {
  return jwt.verify(token, SECRET_KEY, options);
};
