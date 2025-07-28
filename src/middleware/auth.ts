import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

declare global {
  namespace Express {
    interface Request {
      user?: { uid: string };
    }
  }
}

admin.initializeApp();

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).send('No token');

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { uid: decodedToken.uid };
    next();
  } catch (err) {
    return res.status(403).send('Unauthorized');
  }
};
