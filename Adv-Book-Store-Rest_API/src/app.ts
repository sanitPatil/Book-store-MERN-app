import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import stripe from './utils/Stripe.Utils';
import cors from 'cors';
const app = express();
app.use(
  express.json({
    limit: '16kb',
  })
);

app.use(
  express.urlencoded({
    limit: '16kb',
    extended: true,
  })
);

app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
import { userRouter } from './routers/User.Routers';
app.use('/api/v1/users', userRouter);

import { bookRouter } from './routers/Book.Routers';
app.use('/api/v1/books', bookRouter);

import { cartRouter } from './routers/Cart.Routers';
app.use('/api/v1/cart', cartRouter);

import { payRouter } from './routers/Payment.Routers';
app.use('/api/v1/checkout', payRouter);

import { purchaseRouter } from './routers/Purchase.Routers';
app.use('/api/v1/purchase', purchaseRouter);




// WEB-HOOK-HANDLER FOR SUCCESS AND CANCEL
app.post('webhook/', async(request:Request,response:Response,next:NextFunction):  Promise<any>=>{
 const payload = request.body
 const sign = request.headers['stripe-signature']

 let event;
 try {
    event = stripe.webhooks.constructEvent(
      payload,sign!,process.env.SIGNING_SECRET_STRIPE!
    )
 } catch (error) {
  console.log(error);
  return response.status(400).json({success:false})
  
 }
 console.log(`hello webhooks`);
 console.log(event);
 console.log(event.type);
 console.log(event.data.object);
//  console.log(event.data.object.id);
return response.json({success:true}) 
 
 
 
})
// global error handler

import { APIError } from './utils/APIError.utils';

app.use(function (
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction
): any {
  return res.status(err.statusCode || 500).json({
    success: err.success || false,
    status: err.statusCode || 500,
    message: err.message || 'Internal server Error!!!',
    error: err.errors || null,
    stackTree: process.env.ENV_MODE === 'Development' ? err.stack : undefined,
  });
});
export default app;
