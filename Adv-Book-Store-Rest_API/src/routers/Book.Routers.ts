import e from 'express';
import {
  GetAllBooks,
  GetBookById,
  uploadBook,
} from '../controllers/BookUpload.Controllers';
import { authenticationByToken } from '../middlewares/Authentication.Middlewares';
import { upload } from '../middlewares/Multer.Middlewares';

const bookRouter = e.Router();
bookRouter.route('/upload-book').post(
  authenticationByToken,
  upload.fields([
    {
      name: 'bookcoverPage',
      maxCount: 1,
    },
    {
      name: 'bookFile',
      maxCount: 1,
    },
  ]),
  uploadBook
);

bookRouter.route('/all-books').get(authenticationByToken, GetAllBooks);
bookRouter.route('/book/:bookId').get(authenticationByToken, GetBookById);

export { bookRouter };
