import { NextFunction, Request, Response } from 'express';
import { APIError } from '../utils/APIError.utils';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId: string;
}
export async function authenticationByToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token =
      req.cookies.accessToekn || req?.header('Authorization')?.split(' ')[1];

    if (!token)
      return next(
        new APIError(false, 400, `Error::Bad Request, Token is Missing`, [
          'Error::Bad Request, Token is Missing',
        ])
      );

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as string | JwtPayload;

    if (!decodedToken) {
      return next(
        new APIError(
          false,
          401,
          `Error::Unauthorized request, token has expired!`,
          [`Error::Unauthorized request, token has expired!`]
        )
      );
    }

    const id = (decodedToken as JwtPayload)._id as string;

    const _req = req as AuthRequest;
    _req.userId = id;

    next();
  } catch (error) {
    console.error(`server internal issue,failed to authenticate`, error);
    return next(
      new APIError(
        false,
        500,
        `Error::server internal issue, failed to serve request`,
        ['`Error::server internal issue, failed to serve request`']
      )
    );
  }
}
