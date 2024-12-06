import e from 'express';
import { authenticationByToken } from '../middlewares/Authentication.Middlewares';
import { addListToCart, getCartList } from '../controllers/Cart.Controllers';

const cartRouter = e.Router();

cartRouter.route('/save-cart').post(authenticationByToken, addListToCart);
cartRouter.route('/get-cart').get(authenticationByToken, getCartList);

export { cartRouter };
