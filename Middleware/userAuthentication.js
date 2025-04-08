import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifytoken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract actual token

    jwt.verify(token, process.env.USER_SECRET_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Unauthorized - Invalid token' });
      }

      req.email = decoded.email;
      next();
    });

  } catch (error) {
    return res.status(500).json({ error: 'Server error in token verification' });
  }
};
