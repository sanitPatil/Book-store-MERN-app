import { NextFunction, Request, Response } from 'express';
import { APIError } from '../utils/APIError.utils';
import { APIResponse } from '../utils/APIResponse.Utils';
// import Stripe from 'stripe';
import BookModel from '../models/Book.Models';
import PaymentModel from '../models/PaymentDetails.Models';
import { AuthRequest } from '../middlewares/Authentication.Middlewares';
import bcryptjs from 'bcryptjs';
import stripe from '../utils/Stripe.Utils';
export async function createOrderSession(
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

    const { product } = req?.body;

    if (!product) {
      return next(
        new APIError(false, 400, 'Error::product object missing', [
          'product object missing',
        ])
      );
    }
    // console.log(product);

    const productFromDB = await BookModel.findOne({ _id: product?.book?._id });

    if (!productFromDB)
      return next(
        new APIError(false, 500, `Error::Internal server Error`, [
          'Server failed to find product in DB',
        ])
      );

    if (!(product.quantity <= productFromDB.bookInStock))
      return next(
        new APIError(false, 500, 'book is out of stock', ['book-out-of-stock!'])
      );

    productFromDB.bookInStock = productFromDB.bookInStock - product.quantity;
    await productFromDB.save();

    const price = productFromDB.bookPrice;

    // const stripe = new Stripe(`${process.env.STRIPE_P_KEY}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: product?.book?.bookName,
            },
            unit_amount: price * 100,
          },
          quantity: product.quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.STRIPE_SUCCESS_URI}`,
      cancel_url: `${process.env.STRIPE_CANCEL_URI}`,
    });

    // const sessionId = await bcryptjs.hash(session.id, 10);

    // const contact = parseInt(product.contact);

    // const savePaymentData = await PaymentModel.create({
    //   buyerId: userId,
    //   bookId: productFromDB._id,
    //   quantity: product.quantity,
    //   amount: price,
    //   status: true,
    //   paymentId: sessionId,
    //   paymentMode: 'online',
    //   payerName: product.name,
    //   payerContact: contact,
    // });

    // if (!savePaymentData) {
    //   console.log(`failed to save to db`);
    // } else {
    //   console.log(`saccessfully saved!`);
    // }

    return res
      .status(200)
      .json(
        new APIResponse(200, true, 'session-creation-successfully', session)
      );
  } catch (error) {
    console.error(
      `server internal issue,failed to create session for order`,
      error
    );
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
