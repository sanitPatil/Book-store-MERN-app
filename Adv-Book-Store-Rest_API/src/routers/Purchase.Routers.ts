import e from 'express';
import { authenticationByToken } from '../middlewares/Authentication.Middlewares';
import { getPurchaseHistory } from '../controllers/GetPurchaseList.controllers';

const purchaseRouter = e.Router();

purchaseRouter
  .route('/get-purchase-history')
  .get(authenticationByToken, getPurchaseHistory);
export { purchaseRouter };
