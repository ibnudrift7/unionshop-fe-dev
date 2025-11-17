'use client';

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { guestService } from '@/services/guest';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from '@/types/auth';
import type {
  RegisterGuestPayload,
  RegisterGuestResponse,
} from '@/types/guest';
import { HttpError } from '@/services/http';

export const useLoginMutation = (
  options?: UseMutationOptions<AuthResponse, HttpError, LoginPayload>,
) =>
  useMutation<AuthResponse, HttpError, LoginPayload>({
    mutationKey: ['auth', 'login'],
    mutationFn: (payload) => authService.login(payload).then((res) => res.data),
    ...options,
  });

export const useRegisterMutation = (
  options?: UseMutationOptions<AuthResponse, HttpError, RegisterPayload>,
) =>
  useMutation<AuthResponse, HttpError, RegisterPayload>({
    mutationKey: ['auth', 'register'],
    mutationFn: (payload) =>
      authService.register(payload).then((res) => res.data),
    ...options,
  });

export const useForgotPasswordMutation = (
  options?: UseMutationOptions<AuthResponse, HttpError, { email: string }>,
) =>
  useMutation<AuthResponse, HttpError, { email: string }>({
    mutationKey: ['auth', 'forgot-password'],
    mutationFn: ({ email }) =>
      authService.forgotPassword(email).then((res) => res.data),
    ...options,
  });

export const useRegisterGuestMutation = (
  options?: UseMutationOptions<
    RegisterGuestResponse,
    HttpError,
    RegisterGuestPayload
  >,
) =>
  useMutation<RegisterGuestResponse, HttpError, RegisterGuestPayload>({
    mutationKey: ['auth', 'register-guest'],
    mutationFn: (payload) =>
      guestService.registerGuest(payload).then((res) => res.data),
    ...options,
  });

export const useResetPasswordMutation = (
  options?: UseMutationOptions<
    ResetPasswordResponse,
    HttpError,
    ResetPasswordPayload
  >,
) =>
  useMutation<ResetPasswordResponse, HttpError, ResetPasswordPayload>({
    mutationKey: ['auth', 'reset-password'],
    mutationFn: (payload) =>
      authService.resetPassword(payload).then((res) => res.data),
    ...options,
  });
