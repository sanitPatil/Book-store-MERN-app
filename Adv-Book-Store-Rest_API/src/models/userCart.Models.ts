import mongoose, { Schema, Document } from 'mongoose';

export interface Cart extends Document {
  ownerId: mongoose.Types.ObjectId;
  cartList: [];
}

const CartSchema: Schema<Cart> = new Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
    },
    cartList: [],
  },
  { timestamps: true }
);

const CartModel = mongoose.model<Cart>('CartModel', CartSchema);
export default CartModel;
