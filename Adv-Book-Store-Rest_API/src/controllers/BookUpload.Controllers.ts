//1. create/upload book

import { NextFunction, Request, Response } from 'express';
import { APIError } from '../utils/APIError.utils';
import fs from 'node:fs';
import { UploadOnCloud } from '../utils/Cloudinary.Utils';
import BookModel from '../models/Book.Models';
import { APIResponse } from '../utils/APIResponse.Utils';

export async function uploadBook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    // get all data
    const { bookName, bookDescription, bookPrice, bookInStock } = req.body;

    // validate bookname bookdescription bok price book in stock
    if (!bookName || !bookDescription || !bookInStock || !bookPrice)
      return next(
        new APIError(false, 400, `Bad Request::fields are missing!`, [
          'Error::Bad Request, required fileds are missing, bookName,bookDescription,bookInStock,bookPrice',
        ])
      );

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const { bookcoverPage, bookFile } = files;

    if (bookcoverPage?.length === 0) {
      fs.unlink(bookFile[0].path, () =>
        console.log('remove file successfully from local,')
      );
      return next(
        new APIError(
          false,
          400,
          `Error::Bad Request, Book-cover-page file is missing`,
          ['Error::book cover page missing']
        )
      );
    }
    if (bookFile.length === 0) {
      fs.unlink(bookcoverPage[0].path, () =>
        console.log('remove file successfully from local,')
      );
      return next(
        new APIError(
          false,
          400,
          `Error::Bad Request,book-file file is missing`,
          ['Error::book file missing']
        )
      );
    }

    const uploadCover = await UploadOnCloud(bookcoverPage[0]);
    const uploadFile = await UploadOnCloud(bookFile[0]);

    const newBook = await BookModel.create({
      bookName,
      bookDescription,
      bookPrice,
      bookInStock,
      bookcoverPage: uploadCover.url,
      bookFile: uploadFile.url,
    });

    // return response

    return res
      .status(201)
      .json(new APIResponse(201, true, `Book-added-successfully`, newBook));
  } catch (error) {
    console.error(`Internal server issue failed to uplaod book, ${error}`);
    return next(
      new APIError(
        false,
        500,
        `Error::Internal server issue, failed to serve request`,
        ['Error::failed to publish book']
      )
    );
  }
}
//2. list all books
export async function GetAllBooks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const AllBooks = await BookModel.find();
    return res
      .status(200)
      .json(
        new APIResponse(200, true, 'successfully-fetch-all-data', AllBooks)
      );
  } catch (error) {
    console.error(`server failed to load Data,${error}`);
    return next(
      new APIError(
        false,
        500,
        `Error::Server internal issue,failed to serve the request`,
        ['Error::Server internal issue, failed to serve the request']
      )
    );
  }
}
//3. getBookDetails
export async function GetBookById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const bookId = req.params.bookId;
    // console.log(bookId);
    if (!bookId)
      return next(
        new APIError(
          false,
          400,
          `Error::Bad Request, required fields are missing!`,
          ['Error::book id missing']
        )
      );

    const book = await BookModel.findById(bookId);

    if (!book)
      return next(
        new APIError(false, 400, `Error::required file is empty`, [
          'Error:: data is empty',
        ])
      );

    return res
      .status(200)
      .json(new APIResponse(200, true, 'successfully-fetch-book-by-id', book));
  } catch (error) {
    console.error(`server internal issue,failed to get book`, error);
    return next(
      new APIError(false, 500, 'Error::server failed to serve request', [
        'Error::server internal issue',
        'failed to get files',
      ])
    );
  }
}
