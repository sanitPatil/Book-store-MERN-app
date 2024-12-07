import { NextFunction, Request, Response } from 'express';
import { APIError } from '../utils/APIError.utils';
import { AuthRequest } from '../middlewares/Authentication.Middlewares';
import PaymentModel from '../models/PaymentDetails.Models';
import { APIResponse } from '../utils/APIResponse.Utils';

export async function getPurchaseHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const _req = req as AuthRequest;
    const userId = _req.userId as string;

    if (!userId) {
      return next(
        new APIError(
          false,
          500,
          `Error::Internal server Error failed to get userId`,
          ['Server failed to find userID']
        )
      );
    }

    const purchaseList = await PaymentModel.find({ buyerId: userId });

    if (!purchaseList)
      return next(
        new APIError(false, 500, `server failed to get list`, [
          'server failed to get list',
        ])
      );

    return res
      .status(200)
      .json(
        new APIResponse(
          200,
          true,
          `successfully-fetch-purchase-list`,
          purchaseList
        )
      );
  } catch (error) {
    console.error(`Error::server internal issue`, error);
    return next(
      new APIError(false, 500, `server internal issue`, [
        'failed to get purchase list',
      ])
    );
  }
}
