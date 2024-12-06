import e from 'express';
import {
  LoginUser,
  LogoutUser,
  RegisterUser,
} from '../controllers/User.Controllers';
import { upload } from '../middlewares/Multer.Middlewares';
import { authenticationByToken } from '../middlewares/Authentication.Middlewares';

const userRouter = e.Router();
userRouter.route('/sign-up').post(upload.single('avatar'), RegisterUser);
userRouter.route('/sign-in').post(LoginUser);
userRouter.route('/sign-out').get(authenticationByToken, LogoutUser);
export { userRouter };
