import type { UserAddressDocument } from '../models/user-address.model';
import type { UserDocument } from '../models/user.model';
import type {
  LoginInput,
  RegisterInput,
} from '../validators/auth.validator';

export type { LoginInput, RegisterInput };

export type AuthResult = {
  accessToken: string;
  defaultAddress: UserAddressDocument | null;
  hasAddress: boolean;
  user: UserDocument;
};
