import { API } from './axios-client';

/**
 * Every call the app makes to the Chowly API lives here, one function per
 * endpoint. Screens pass these straight to TanStack Query:
 *
 *   useMutation({ mutationFn: loginMutationFn })
 *   useQuery({ queryKey: ["currentUser"], queryFn: getCurrentUserQueryFn })
 */

export type UserRole = 'customer' | 'driver' | 'admin';

export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AddressLabel = 'Home' | 'Work' | 'Other';

export type Address = {
  _id: string;
  userId: string;
  label: AddressLabel;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  instructions?: string;
  location?: { type: 'Point'; coordinates: [number, number] };
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

type AuthResponse = {
  message: string;
  data: {
    accessToken: string;
    hasAddress: boolean;
    defaultAddress: Address | null;
    user: User;
  };
};
type UserResponse = {
  message: string;
  data: { hasAddress: boolean; defaultAddress: Address | null; user: User };
};

type AddressesResponse = { message: string; data: { addresses: Address[] } };
type AddressResponse = { message: string; data: { address: Address } };
type MessageResponse = { message: string };

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AddressInput = {
  label: AddressLabel;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  instructions?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
};

// <======== Auth-Routes ========>
export const registerMutationFn = async (
  input: RegisterInput,
): Promise<AuthResponse> => API.post('/auth/register', input);

export const loginMutationFn = async (
  input: LoginInput,
): Promise<AuthResponse> => API.post('/auth/login', input);

export const logoutMutationFn = async (): Promise<MessageResponse> =>
  API.post('/auth/logout');

export const getCurrentUserQueryFn = async (): Promise<UserResponse> =>
  API.get('/auth/me');

// <======== Addresses-Routes ========>
export const getAddressesQueryFn = async (): Promise<AddressesResponse> =>
  API.get('/addresses');

export const createAddressMutationFn = async (
  input: AddressInput,
): Promise<AddressResponse> => API.post('/addresses', input);

export const updateAddressMutationFn = async ({
  id,
  ...input
}: AddressInput & { id: string }): Promise<AddressResponse> =>
  API.patch(`/addresses/${id}`, input);

export const setDefaultAddressMutationFn = async (
  id: string,
): Promise<AddressResponse> => API.patch(`/addresses/${id}/default`);

export const deleteAddressMutationFn = async (
  id: string,
): Promise<MessageResponse> => API.delete(`/addresses/${id}`);
