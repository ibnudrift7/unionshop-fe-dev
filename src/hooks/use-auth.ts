'use client';

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth';
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
