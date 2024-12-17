import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  name: string;
  username: string;
  password: string;
  email: string;
  avatar?: string;
  accessToken: string;
  refreshToken: string;
}

const userSchema: Schema<User> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<User>('UserModel', userSchema);

export default UserModel;
