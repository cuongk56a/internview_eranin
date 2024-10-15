import mongoose from 'mongoose';
import { IUserDoc, UserGender } from './user.type';
import { IDocModel } from '../../utils/types/entityTypes';
import { TABLE_USER } from './user.configs';
import paginateM from 'mongoose-paginate-v2'
import { toJSON } from '../../utils/toJson';

export interface IUserModelDoc extends IUserDoc { }
interface IUserModel extends IDocModel<IUserModelDoc> { }

const userSchema = new mongoose.Schema<IUserModelDoc>(
  {
    email: {
      type: String,
      required: true,
      index: { unique: true, sparse: true },
    },
    fullName: {
      type: String,
    },
    hashedPassword: {
      type: String,
      required: false,
      private: true,
    },
    updatedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    deletedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    deletedAt: { type: Date, required: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.plugin(toJSON);
userSchema.plugin(paginateM);

userSchema.index({ email: 1 });
userSchema.index({ fullName: 'text' });

/**
 * @typedef User
 */
export const UserModel = mongoose.model<IUserModelDoc, IUserModel>(TABLE_USER, userSchema);
