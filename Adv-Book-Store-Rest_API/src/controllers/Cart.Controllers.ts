import { NextFunction, Request, Response } from 'express';
import { APIError } from '../utils/APIError.utils';
import CartModel from '../models/userCart.Models';
import { APIResponse } from '../utils/APIResponse.Utils';
import { AuthRequest } from '../middlewares/Authentication.Middlewares';

export const addListToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { cartList } = req.body;
    // console.log('New Cart-list', cartList);

    const _req = req as AuthRequest;
    const userId = _req.userId as string;

    if (!cartList) {
      return next(
        new APIError(false, 400, `Error::Bad Request, cart-list missing`, [
          'Error:: Missing required field!',
        ])
      );
    }
    const updatedCart = await CartModel.findOneAndUpdate(
      { ownerId: userId },
      { $set: { cartList } },
      { new: true, upsert: true }
    );

    return res
      .status(200)
      .json(
        new APIResponse(
          200,
          true,
          'successfully-store-updated-cart-list',
          updatedCart
        )
      );
  } catch (error) {
    console.error(`Error failed to add cart-list,${error}`);
    return next(
      new APIError(
        false,
        500,
        `Error::server internal issue,failed to serve request`,
        ['Error::server internal issue,failed to save add-to-cart-list']
      )
    );
  }
};

export const getCartList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const _req = req as AuthRequest;
    const userId = _req.userId as string;

    const list = await CartModel.find({ ownerId: userId });

    if (!list) {
      return res
        .status(200)
        .json(new APIResponse(200, true, `your cart is empty`, []));
    } else {
      return res
        .status(200)
        .json(new APIResponse(200, true, `successfully-fetch cart-list`, list));
    }
  } catch (error) {
    console.error(`Error, Server internal issue, ${error}`);
    return next(
      new APIError(
        false,
        500,
        `Error::server internal issue, failed to serve request`,
        ['Error:: failed to serve get-cart-list']
      )
    );
  }
};
