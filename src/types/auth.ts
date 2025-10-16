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
  email?: string;
  phone?: string;
  gender?: string;
}

export interface AuthResponse {
  message?: string;
  data?: {
    user?: AuthUser;
    tokens?: AuthTokens;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
