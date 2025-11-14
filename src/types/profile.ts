export interface ProfileData {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  gender?: string;
  date_of_birth: string;
  points_balance: number;
  created_at: string;
}

export interface ProfileResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: ProfileData;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone: string;
  gender: 'wanita' | 'pria';
  dateOfBirth: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
