import { NextFunction, Request, Response } from 'express';
import { APIError } from '../utils/APIError.utils';
import { AuthRequest } from '../middlewares/Authentication.Middlewares';
import PaymentModel from '../models/PaymentDetails.Models';
import { APIResponse } from '../utils/APIResponse.Utils';
import mongoose from 'mongoose';
import BookModel from '../models/Book.Models';

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

    const purchaseData = await PaymentModel.aggregate([
      {
        $match: {
          buyerId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'usermodels',
          localField: 'buyerId',
          foreignField: '_id',
          as: 'buyerDetails',
          pipeline: [
            {
              $project: {
                name: 1,
                useername: 1,
                email: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'bookmodels',
          localField: 'bookId',
          foreignField: '_id',
          as: 'buyBookDetails',
          pipeline: [
            {
              $project: {
                _id: 1,
                bookName: 1,
                bookeDescription: 1,
                bookcoverPage: 1,
                bookInStock: 1,
                bookPrice: 1,
                bookFile: 1,
                bookOwner: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$buyBookDetails',
        },
      },
      {
        $unwind: {
          path: '$buyerDetails',
        },
      },
      {
        $project: {
          _id: 1,
          quantity: 1,
          amount: 1,
          paymentMode: 1,
          status: 1,
          paymentId: 1,
          payerContact: 1,
          buyerDetails: 1,
          buyBookDetails: 1,
        },
      },
    ]);

    console.log(purchaseData);

    if (!purchaseData)
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
          purchaseData
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
