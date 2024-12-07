import e from 'express';
import { createOrderSession } from '../controllers/paymentOrderCreateSession';
import { authenticationByToken } from '../middlewares/Authentication.Middlewares';
const payRouter = e.Router();

payRouter
  .route('/create-order-session')
  .post(authenticationByToken, createOrderSession);
export { payRouter };
