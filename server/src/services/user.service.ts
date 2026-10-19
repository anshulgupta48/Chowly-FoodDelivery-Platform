import { UserDocument, UserModel } from '../models/user.model';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const findUserByEmail = (
  email: string,
): Promise<UserDocument | null> =>
  UserModel.findOne({ email: normalizeEmail(email) }).exec();

export const findUserByEmailWithPassword = (
  email: string,
): Promise<UserDocument | null> =>
  UserModel.findOne({ email: normalizeEmail(email) })
    .select('+password')
    .exec();
