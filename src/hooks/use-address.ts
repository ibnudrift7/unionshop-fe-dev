'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addressService } from '@/services/address';
import type {
  DefaultAddressResponse,
  AddressListResponse,
  CreateAddressPayload,
  CreateAddressResponse,
  UpdateAddressPayload,
  UpdateAddressResponse,
  DeleteAddressResponse,
} from '@/types/address';
import { HttpError } from '@/services/http';

export function useDefaultAddressQuery(enabled: boolean = true) {
  return useQuery<DefaultAddressResponse, HttpError>({
    queryKey: ['address', 'default'],
    queryFn: () => addressService.getDefaultAddress().then((r) => r.data),
    enabled,
    staleTime: 60_000,
  });
}

export function useAddressesQuery(enabled: boolean = true) {
  return useQuery<AddressListResponse, HttpError>({
    queryKey: ['address', 'list'],
    queryFn: () => addressService.listAddresses().then((r) => r.data),
    enabled,
    staleTime: 30_000,
  });
}

export function useUpdateAddressMutation() {
  const qc = useQueryClient();
  return useMutation<
    UpdateAddressResponse,
    HttpError,
    { id: number | string; payload: UpdateAddressPayload }
  >({
    mutationKey: ['address', 'update'],
    mutationFn: ({ id, payload }) =>
      addressService.updateAddress(id, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['address', 'list'] });
      qc.invalidateQueries({ queryKey: ['address', 'default'] });
    },
  });
}

export function useDeleteAddressMutation() {
  const qc = useQueryClient();
  return useMutation<DeleteAddressResponse, HttpError, { id: number | string }>(
    {
      mutationKey: ['address', 'delete'],
      mutationFn: ({ id }) =>
        addressService.deleteAddress(id).then((r) => r.data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['address', 'list'] });
        qc.invalidateQueries({ queryKey: ['address', 'default'] });
      },
    },
  );
}

export function useCreateAddressMutation() {
  const qc = useQueryClient();
  return useMutation<CreateAddressResponse, HttpError, CreateAddressPayload>({
    mutationKey: ['address', 'create'],
    mutationFn: (payload) =>
      addressService.createAddress(payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['address', 'list'] });
      qc.invalidateQueries({ queryKey: ['address', 'default'] });
    },
  });
}
