import jwt from 'jsonwebtoken';
import logger from '#config/logger.js';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-please-change-in-production';
const JWT_EXPIRES_IN = '1d';

export const jwtToken = {
  sign: payLoad => {
    try {
      return jwt.sign(payLoad, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      logger.error('Failed to Authenticate token', error);
      throw new Error('Failed to Authenticate token');
    }
  },
  verify: token => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('Failed to Authenticate token', error);
      throw new Error('Failed to Authenticate token');
    }
  },
};
