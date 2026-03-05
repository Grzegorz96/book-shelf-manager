export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accessToken: string;
  refreshToken: string;
}

export type AuthenticatedUser = Omit<User, 'password'>;

export type SignUpFormData = Omit<User, 'id' | 'accessToken' | 'refreshToken'>;

export type UserToSignUp = Omit<User, 'id'>;
