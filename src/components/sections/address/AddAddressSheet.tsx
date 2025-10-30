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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  useProvincesQuery,
  useCitiesQuery,
  useDistrictsQuery,
} from '@/hooks/use-location';
import { useCreateAddressMutation } from '@/hooks/use-address';
import type { Province, City, District } from '@/types/location';
import type { HttpError } from '@/services/http';

export interface AddressPayload {
  recipientName: string;
  phone: string;
  provinceId: number;
  cityId: number;
  districtId: number;
  districtName: string;
  postalCode: string;
  addressDetail: string;
  isDefault?: boolean;
}

export interface AddAddressSheetProps {
  trigger: React.ReactNode;
  onSubmit?: (payload: AddressPayload) => void;
}

export default function AddAddressSheet({
  trigger,
  onSubmit,
}: AddAddressSheetProps) {
  const [open, setOpen] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [provinceId, setProvinceId] = useState<number | ''>('');
  const [cityId, setCityId] = useState<number | ''>('');
  const [districtId, setDistrictId] = useState<number | ''>('');
  const [postalCode, setPostalCode] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [addressDetailError, setAddressDetailError] = useState<string | null>(
    null,
  );
  const [isDefault, setIsDefault] = useState(false);

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
  const [cityQuery, setCityQuery] = useState('');
  const [cityOpen, setCityOpen] = useState(false);
  const [districtQuery, setDistrictQuery] = useState('');
  const [districtOpen, setDistrictOpen] = useState(false);

  const { mutate: createAddress, isPending } = useCreateAddressMutation();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = String(e.target.value || '').replace(/\D/g, '');
    if (v.length > 15) v = v.slice(0, 15);
    setPhone(v);
    if (!v || /^(08|62)\d*$/.test(v)) setPhoneError(null);
    else setPhoneError('Nomor harus diawali dengan 08 atau 62');
  };

  const handleSubmit = () => {
    if (
      !recipientName ||
      !phone ||
      !provinceId ||
      !cityId ||
      !districtId ||
      !postalCode ||
      !addressDetail
    ) {
      toast.error('Semua kolom wajib diisi');
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
    createAddress(
      {
        recipient_name: recipientName,
        phone,
        province_id: provinceId,
        city_id: cityId,
        subdistrict_id: districtId,
        subdistrict_name: districtName,
        address_line: addressDetail,
        postal_code: postalCode,
        is_default: isDefault ? 'true' : 'false',
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || 'Alamat berhasil ditambahkan');
          onSubmit?.({
            recipientName,
            phone,
            provinceId,
            cityId,
            districtId,
            districtName,
            postalCode,
            addressDetail,
            isDefault,
          });
          setRecipientName('');
          setPhone('');
          setProvinceId('');
          setCityId('');
          setDistrictId('');
          setPostalCode('');
          setAddressDetail('');
          setIsDefault(false);
          setOpen(false);
        },
        onError: (err: HttpError) => {
          const raw = err?.data as unknown;
          const obj =
            raw && typeof raw === 'object'
              ? (raw as Record<string, unknown>)
              : {};
          const msg =
            (typeof obj.message === 'string' && obj.message) ||
            'Gagal menambah alamat';
          toast.error(msg);
        },
      },
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side='bottom'
        className='rounded-t-2xl max-h-[85vh] overflow-auto w-full max-w-[720px] left-1/2 -translate-x-1/2 right-auto border-x border-gray-200'
      >
        <SheetHeader>
          <SheetTitle className='text-center text-lg'>Tambah alamat</SheetTitle>
        </SheetHeader>
        <div className='px-4 pb-4 space-y-3'>
          <div className='space-y-1'>
            <Label htmlFor='addr-recipient'>Nama penerima</Label>
            <Input
              id='addr-recipient'
              type='text'
              placeholder='Nama penerima'
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='addr-phone'>Nomor HP</Label>
            <Input
              id='addr-phone'
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
            <Label htmlFor='addr-province'>Provinsi</Label>
            <select
              id='addr-province'
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
            <Label htmlFor='addr-city'>Kota/Kabupaten</Label>
            <div className='relative'>
              <input
                id='addr-city'
                role='combobox'
                aria-expanded={cityOpen}
                aria-controls='addr-city-listbox'
                placeholder={
                  !provinceId
                    ? 'Pilih provinsi dahulu'
                    : loadingCity
                    ? 'Memuat…'
                    : 'Cari atau pilih kota'
                }
                className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
                value={
                  typeof cityId === 'number'
                    ? cities.find((c) => c.id === cityId)?.name ?? ''
                    : cityQuery
                }
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  setCityOpen(true);
                }}
                onFocus={() => setCityOpen(true)}
                disabled={!provinceId}
              />
              {cityOpen && provinceId && (
                <ul
                  id='addr-city-listbox'
                  role='listbox'
                  className='absolute z-20 left-0 right-0 mt-1 max-h-56 overflow-auto bg-white border border-gray-200 rounded-md shadow-sm'
                >
                  {(loadingCity ? [] : cities)
                    .filter((c) =>
                      cityQuery
                        ? c.name.toLowerCase().includes(cityQuery.toLowerCase())
                        : true,
                    )
                    .map((c: City) => (
                      <li
                        key={c.id}
                        role='option'
                        aria-selected={cityId === c.id}
                        className='px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm'
                        onMouseDown={(ev) => ev.preventDefault()}
                        onClick={() => {
                          setCityId(c.id);
                          setCityQuery('');
                          setCityOpen(false);
                          setDistrictId('');
                        }}
                      >
                        {c.name}
                      </li>
                    ))}
                  {!loadingCity && cities.length === 0 && (
                    <li className='px-3 py-2 text-sm text-gray-500'>
                      Tidak ada kota.
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
          <div className='space-y-1'>
            <Label htmlFor='addr-district'>Kecamatan</Label>
            <div className='relative'>
              <input
                id='addr-district'
                role='combobox'
                aria-expanded={districtOpen}
                aria-controls='addr-district-listbox'
                placeholder={
                  !cityId
                    ? 'Pilih kota dahulu'
                    : loadingDist
                    ? 'Memuat…'
                    : 'Cari atau pilih kecamatan'
                }
                className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
                value={
                  typeof districtId === 'number'
                    ? districts.find((d) => d.id === districtId)?.name ?? ''
                    : districtQuery
                }
                onChange={(e) => {
                  setDistrictQuery(e.target.value);
                  setDistrictOpen(true);
                }}
                onFocus={() => setDistrictOpen(true)}
                disabled={!cityId}
              />
              {districtOpen && cityId && (
                <ul
                  id='addr-district-listbox'
                  role='listbox'
                  className='absolute z-20 left-0 right-0 mt-1 max-h-56 overflow-auto bg-white border border-gray-200 rounded-md shadow-sm'
                >
                  {(loadingDist ? [] : districts)
                    .filter((d) =>
                      districtQuery
                        ? d.name
                            .toLowerCase()
                            .includes(districtQuery.toLowerCase())
                        : true,
                    )
                    .map((d: District) => (
                      <li
                        key={d.id}
                        role='option'
                        aria-selected={districtId === d.id}
                        className='px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm'
                        onMouseDown={(ev) => ev.preventDefault()}
                        onClick={() => {
                          setDistrictId(d.id);
                          setDistrictQuery('');
                          setDistrictOpen(false);
                        }}
                      >
                        {d.name}
                      </li>
                    ))}
                  {!loadingDist && districts.length === 0 && (
                    <li className='px-3 py-2 text-sm text-gray-500'>
                      Tidak ada kecamatan.
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
          <div className='space-y-1'>
            <Label htmlFor='addr-postal'>Kode pos</Label>
            <Input
              id='addr-postal'
              type='text'
              inputMode='numeric'
              placeholder='Kode pos'
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='addr-detail'>Detail alamat</Label>
            <textarea
              id='addr-detail'
              rows={3}
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
              className='w-full bg-brand hover:bg-brand/90 text-white'
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? 'Menyimpan…' : 'tambah data pengiriman'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
