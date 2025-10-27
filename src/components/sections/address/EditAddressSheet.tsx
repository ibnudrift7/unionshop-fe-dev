'use client';

import { useMemo, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner'; // optional jika kamu pakai toast
import { Checkbox } from '@/components/ui/checkbox';
import {
  useProvincesQuery,
  useCitiesQuery,
  useDistrictsQuery,
} from '@/hooks/use-location';
import type { Province, City, District } from '@/types/location';

export interface EditAddressPayload {
  phone?: string;
  // New fields for dropdown selections (optional for backward compat)
  provinceId?: number;
  cityId?: number;
  districtId?: number; // kecamatan id
  districtName?: string;
  // Legacy display fields (names)
  province?: string;
  city?: string;
  district?: string;
  postalCode: string; // kode pos
  addressDetail: string;
}

export interface EditAddressSheetProps {
  trigger: React.ReactNode;
  initial?: Partial<EditAddressPayload & { isDefault?: boolean }>;
  onSubmit?: (payload: EditAddressPayload & { isDefault?: boolean }) => void;
}

export default function EditAddressSheet({
  trigger,
  initial,
  onSubmit,
}: EditAddressSheetProps) {
  const [open, setOpen] = useState(false);
  const [provinceId, setProvinceId] = useState<number | ''>(
    initial?.provinceId ?? '',
  );
  const [cityId, setCityId] = useState<number | ''>(initial?.cityId ?? '');
  const [districtId, setDistrictId] = useState<number | ''>(
    initial?.districtId ?? '',
  );
  const [postalCode, setPostalCode] = useState(initial?.postalCode ?? '');
  const [addressDetail, setAddressDetail] = useState(
    initial?.addressDetail ?? '',
  );
  const [addressDetailError, setAddressDetailError] = useState<string | null>(
    null,
  );
  const [isDefault, setIsDefault] = useState<boolean>(!!initial?.isDefault);
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Location dropdown queries
  const { data: provincesRes, isLoading: loadingProv } =
    useProvincesQuery(true);
  const { data: citiesRes, isLoading: loadingCity } = useCitiesQuery(
    provinceId || undefined,
  );
  const { data: distsRes, isLoading: loadingDist } = useDistrictsQuery(
    cityId || undefined,
  );
  const provinces = useMemo(() => provincesRes?.data ?? [], [provincesRes]);
  const cities = useMemo(() => citiesRes?.data ?? [], [citiesRes]);
  const districts = useMemo(() => distsRes?.data ?? [], [distsRes]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = String(e.target.value || '').replace(/\D/g, '');
    if (v.length > 15) v = v.slice(0, 15);
    setPhone(v);
    if (!v || /^(08|62)\d*$/.test(v)) setPhoneError(null);
    else setPhoneError('Nomor harus diawali dengan 08 atau 62');
  };

  const handleSubmit = () => {
    if (
      !provinceId ||
      !cityId ||
      !districtId ||
      !postalCode ||
      !addressDetail
    ) {
      toast?.error?.('Semua kolom harus diisi!');
      return;
    }
    if (addressDetail.trim().length < 10) {
      setAddressDetailError('Detail alamat minimal 10 karakter');
      return;
    }
    if (phone) {
      const digits = phone.replace(/\D/g, '');
      if (!/^(08|62)/.test(digits)) {
        setPhoneError('Nomor harus diawali dengan 08 atau 62');
        return;
      }
      if (!/^\d+$/.test(digits)) {
        setPhoneError('Nomor hanya boleh berisi angka');
        return;
      }
      if (digits.length > 15 || digits.length < 10) {
        setPhoneError('Nomor harus antara 10 hingga 15 digit');
        return;
      }
    }

    const districtObj = districts.find((d) => d.id === districtId);
    const districtName = districtObj?.name ?? '';
    onSubmit?.({
      phone,
      provinceId: typeof provinceId === 'number' ? provinceId : undefined,
      cityId: typeof cityId === 'number' ? cityId : undefined,
      districtId: typeof districtId === 'number' ? districtId : undefined,
      districtName,
      postalCode,
      addressDetail,
      isDefault,
    });
    toast?.success?.('Alamat berhasil diperbarui');
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side='bottom'
        className='rounded-t-2xl max-h-[85vh] overflow-auto w-full max-w-[720px] left-1/2 -translate-x-1/2 right-auto border-x border-gray-200'
      >
        <SheetHeader>
          <SheetTitle className='text-center text-lg'>Edit alamat</SheetTitle>
        </SheetHeader>
        <div className='px-4 pb-4 space-y-3'>
          <div className='space-y-1'>
            <Label htmlFor='edit-phone'>Nomor HP</Label>
            <Input
              id='edit-phone'
              type='tel'
              inputMode='tel'
              placeholder='08xxxxxxxxxx'
              value={phone}
              onChange={handlePhoneChange}
              maxLength={15}
            />
            {phoneError ? (
              <p className='text-xs text-red-600'>{phoneError}</p>
            ) : null}
          </div>
          <div className='space-y-1'>
            <Label htmlFor='edit-province'>Provinsi</Label>
            <select
              id='edit-province'
              className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
              value={provinceId}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : '';
                setProvinceId(val);
                setCityId('');
                setDistrictId('');
              }}
            >
              <option value='' disabled>
                {loadingProv ? 'Memuat…' : 'Pilih provinsi'}
              </option>
              {provinces.map((p: Province) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className='space-y-1'>
            <Label htmlFor='edit-city'>Kota/Kabupaten</Label>
            <select
              id='edit-city'
              className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
              value={cityId}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : '';
                setCityId(val);
                setDistrictId('');
              }}
              disabled={!provinceId}
            >
              <option value='' disabled>
                {!provinceId
                  ? 'Pilih provinsi dahulu'
                  : loadingCity
                  ? 'Memuat…'
                  : 'Pilih kota/kabupaten'}
              </option>
              {cities.map((c: City) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className='space-y-1'>
            <Label htmlFor='edit-district'>Kecamatan</Label>
            <select
              id='edit-district'
              className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
              value={districtId}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : '';
                setDistrictId(val);
              }}
              disabled={!cityId}
            >
              <option value='' disabled>
                {!cityId
                  ? 'Pilih kota dahulu'
                  : loadingDist
                  ? 'Memuat…'
                  : 'Pilih kecamatan'}
              </option>
              {districts.map((d: District) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className='space-y-1'>
            <Label htmlFor='edit-postal'>Kode pos</Label>
            <Input
              id='edit-postal'
              type='text'
              inputMode='numeric'
              placeholder='Kode pos'
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='edit-detail'>Detail alamat</Label>
            <textarea
              id='edit-detail'
              rows={3}
              required
              className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm'
              placeholder='Nama jalan, no rumah, RT/RW, patokan, dsb.'
              value={addressDetail}
              onChange={(e) => {
                const v = (e.target as HTMLTextAreaElement).value;
                setAddressDetail(v);
                if (v.trim().length >= 10) setAddressDetailError(null);
                else setAddressDetailError('Detail alamat minimal 10 karakter');
              }}
            />
            {addressDetailError ? (
              <p className='text-xs text-red-600'>{addressDetailError}</p>
            ) : null}
          </div>
          <div className='pt-1'>
            <div className='flex items-center gap-2'>
              <Checkbox
                id='addr-default'
                checked={isDefault}
                onCheckedChange={(checked) => setIsDefault(!!checked)}
              />
              <Label htmlFor='addr-default' className='text-sm'>
                Jadikan sebagai alamat utama
              </Label>
            </div>
          </div>

          <div className='pt-2'>
            <Button
              type='button'
              className='w-full bg-brand hover:bg-brand/90 text-white'
              onClick={handleSubmit}
            >
              simpan data pengiriman
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
