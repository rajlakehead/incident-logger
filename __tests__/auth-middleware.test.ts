import { authenticate } from '../src/middleware/auth' 
import { Request, Response, NextFunction } from 'express';

// Create a manual mock for admin.auth().verifyIdToken
const mockVerifyIdToken = jest.fn();

jest.mock('firebase-admin', () => {
  return {
    initializeApp: jest.fn(),
    auth: () => ({
      verifyIdToken: mockVerifyIdToken,
    }),
  };
});

describe('authenticate middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
    mockVerifyIdToken.mockReset();
  });

  it('should return 401 if no token provided', async () => {
    await authenticate(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('No token');
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', async () => {
    req.headers = { authorization: 'Bearer invalidtoken' };
    mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));

    await authenticate(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Unauthorized');
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if token is valid', async () => {
    req.headers = { authorization: 'Bearer validtoken' };
    mockVerifyIdToken.mockResolvedValue({ uid: '12345' });

    await authenticate(req as Request, res as Response, next);

    expect(req.user).toEqual({ uid: '12345' });
    expect(next).toHaveBeenCalled();
  });
});
