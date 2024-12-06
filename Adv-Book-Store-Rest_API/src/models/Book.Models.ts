import mongoose, { Schema, Document } from 'mongoose';
export interface Book extends Document {
  bookName: string;
  bookDescription: string;
  bookPrice: number;
  bookInStock: number;
  bookcoverPage: string;
  bookFile: string;
  bookOwner: mongoose.Types.ObjectId;
}

const bookSchema: Schema<Book> = new Schema(
  {
    bookName: {
      type: String,
      required: true,
      trim: true,
    },
    bookDescription: {
      type: String,
      required: true,
    },
    bookcoverPage: {
      type: String,
      required: true,
    },
    bookInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    bookPrice: {
      type: Number,
      required: true,
    },
    bookFile: {
      type: String,
      required: true,
    },
    bookOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
    },
  },
  { timestamps: true }
);

const BookModel = mongoose.model<Book>('BookModel', bookSchema);

export default BookModel;
