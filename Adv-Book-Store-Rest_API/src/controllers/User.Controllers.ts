import { NextFunction, Request, Response } from 'express';
import { APIError } from '../utils/APIError.utils';
import UserModel, { User } from '../models/User.Models';
import bcryptjs from 'bcryptjs';
import { UploadOnCloud } from '../utils/Cloudinary.Utils';
import { APIResponse } from '../utils/APIResponse.Utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/Authentication.Middlewares';

const generateAccessTokenAndRefreshToken = async (user: User): Promise<any> => {
  try {
    const accessToken = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        name: user.name,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        name: user.name,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(`failed to generate access token,${error}`);
    process.exit(1);
  }
};

export async function RegisterUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const { username, name, email, password } = req.body;

    if (!username || !name || !email || !password) {
      return next(
        new APIError(
          false,
          400,
          `Error::Bad Request: Missing Required Fileds!`,
          [
            'Error::Bad Request: Missing Required Fileds!',
            'Error::username, email, name, password fields are missing!',
          ]
        )
      );
    }

    const existsingUserByEmailAndUsername = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    console.log(existsingUserByEmailAndUsername);

    if (existsingUserByEmailAndUsername) {
      return next(
        new APIError(
          false,
          409,
          `Error::Conflict:user already exists, please login!`,
          ['Error:: user already exists']
        )
      );
    }

    const avatar = req.file;
    if (!avatar) {
      return next(
        new APIError(
          false,
          400,
          'Error::Bad Request: required filed missing,Avatar',
          ['Error:: Avatar is Missing']
        )
      );
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const cloudRes = await UploadOnCloud(avatar);

    const newUser = await UserModel.create({
      username,
      email,
      name,
      password: hashPassword,
      avatar: cloudRes.url || '',
    });

    if (!newUser) {
      return next(
        new APIError(
          false,
          500,
          `Error::Internal server issue, failed to save register user!`,
          ['Error::server issue,failed to save register user!']
        )
      );
    }

    const user = await UserModel.findById(newUser._id);

    return res
      .status(201)
      .json(new APIResponse(201, true, `User Register Sucessfully!`, user));
  } catch (error) {
    console.error(`Issue While Registering User,${error}`);
    return next(
      new APIError(
        false,
        500,
        'Error::server internal issue,failed to serve the request!',
        ['Error::Internal server issue,failed to serve request!']
      )
    );
  }
}

export async function LoginUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const { email, password } = req.body;

    if (!email) {
      return next(
        new APIError(false, 400, 'Error::Bad Request, fileds are missing!', [
          'Error::Bad Request, email is missing!',
        ])
      );
    }

    if (!password) {
      return next(
        new APIError(false, 400, `Error::Bad Request,password filed missing!`, [
          'Error::Bad Request, password missing!',
        ])
      );
    }

    const existingUserByIdentifier = await UserModel.findOne({ email });

    if (!existingUserByIdentifier) {
      return next(
        new APIError(
          false,
          409,
          `Error::Conflict, user  not exists, please register`,
          ['Error::user not exists']
        )
      );
    }

    const validatePassword = await bcryptjs.compare(
      password,
      existingUserByIdentifier.password
    );
    if (!validatePassword) {
      return next(
        new APIError(
          false,
          401,
          'Error::Bad Request, password does not match!',
          ['Error::password does not match!']
        )
      );
    }

    const user = await UserModel.findById(existingUserByIdentifier._id).select(
      '-password -refreshToken'
    );

    if (!user) {
      return next(
        new APIError(false, 500, 'server internal issue,failed to find user', [
          'server internal issue,failed to get user',
        ])
      );
    }
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user);
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await user?.save();
    console.log();

    return res
      .status(200)
      .cookie('accessToekn', accessToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .json(
        new APIResponse(200, true, `User-Successfully-Login`, {
          user,
          AccessToken: accessToken,
          RefreshToken: refreshToken,
        })
      );
  } catch (error) {
    console.error(`Server Internal issue, Login Error,${error}`);
    return next(
      new APIError(
        false,
        500,
        `Error::server Intenal Issue, failed to login user`,
        ['Error::server Intenal Issue, failed to login user', `${error}`]
      )
    );
  }
}

export async function LogoutUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const _req = req as AuthRequest;
    const userId = _req.userId as string;
    if (!userId) {
      return next(
        new APIError(false, 500, `Error::server failed to process request!`, [
          '`Error::server failed to process request!, failed to get user Id!`',
        ])
      );
    }

    const unsetAccessToken = await UserModel.findByIdAndUpdate(
      userId,
      {
        $unset: { accessToken: 1 },
      },
      { new: true }
    );

    return res
      .clearCookie('accessToekn', {
        secure: true,
        httpOnly: true,
      })
      .status(200)
      .json(new APIResponse(200, true, 'user-successfully-log-out', null));
  } catch (error) {
    console.error('srver internal issue failed to logout,', error);
    return next(
      new APIError(
        false,
        500,
        `Error::server internal issue,failed to serve request!`,
        ['Error::failed to serve logout-request']
      )
    );
  }
}
