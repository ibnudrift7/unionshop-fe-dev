export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: 'wanita' | 'pria' | '';
  dateOfBirth?: string;
  province?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  addressDetail?: string;
}

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
}

export interface AuthUser {
  id?: string;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
}

export interface AuthResponse {
  message?: string;
  data?: {
    user?: AuthUser;
    token?: string;
    tokens?: AuthTokens;
    [key: string]: unknown;
  };
  statusCode?: number;
  success?: boolean;
  [key: string]: unknown;
}

export interface VerifyEmailResponse {
  statusCode?: number;
  message?: string;
  success?: boolean;
}
