import mongoose, { Schema, Document } from 'mongoose';

export interface Payment extends Document {
  bookId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  quantity: number;
  amount: number;
  paymentMode: string;
  status: boolean;
  paymentId: string;
  payerName: string;
  payerContact: number;
}

const PaymentSchema: Schema<Payment> = new Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookModel',
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
    },
    quantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number, 
      required: true,
    },
    paymentMode: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    payerName: {
      type: String,
      required: true,
    },
    payerContact: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model<Payment>('PaymentModel', PaymentSchema);
export default PaymentModel;
