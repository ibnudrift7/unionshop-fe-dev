'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/profile';
import type {
  ProfileResponse,
  UpdatePasswordPayload,
  UpdateProfilePayload,
} from '@/types/profile';
import { HttpError } from '@/services/http';

export function useProfileQuery(enabled: boolean = true) {
  return useQuery<ProfileResponse, HttpError>({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile().then((r) => r.data),
    enabled,
    staleTime: 60_000,
  });
}

export function useUpdateProfileMutation() {
  const qc = useQueryClient();
  return useMutation<ProfileResponse, HttpError, UpdateProfilePayload>({
    mutationKey: ['profile', 'update'],
    mutationFn: (payload) =>
      profileService.updateProfile(payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useUpdatePasswordMutation() {
  return useMutation<
    Pick<ProfileResponse, 'statusCode' | 'message' | 'success'>,
    HttpError,
    UpdatePasswordPayload
  >({
    mutationKey: ['profile', 'update-password'],
    mutationFn: (payload) =>
      profileService.updatePassword(payload).then((r) => r.data),
  });
}
