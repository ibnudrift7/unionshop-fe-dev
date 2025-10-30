'use client';

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { useOrderTrackingQuery } from '@/hooks/use-orders';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onOpenChange: unknown;
  orderId?: number | string;
}

function formatDateParts(dateStr: string) {
  const safe = dateStr.replace(' ', 'T');
  const d = new Date(safe);
  if (isNaN(d.getTime())) {
    return { time: '', date: dateStr };
  }
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes(),
  ).padStart(2, '0')}`;
  const date = d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
  });
  return { time, date };
}

export function OrderTrackingModal({
  isOpen,
  onOpenChange,
  orderId,
}: OrderTrackingModalProps) {
  const { data, isLoading, isError, error } = useOrderTrackingQuery(
    orderId,
    isOpen,
  );

  const history = data?.data.tracking_history.history ?? [];
  const courier = data?.data.courier ?? '';
  const airwayBill = data?.data.tracking_history.airway_bill ?? '';

  const resolvedActiveIndex = history.length > 0 ? history.length - 1 : -1;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange as (open: boolean) => void}
    >
      <DialogContent className='max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0'>
        <DialogHeader className='border-b border-border px-6 py-4'>
          <div className='w-full flex items-start justify-between'>
            <div className='flex items-start gap-4'>
              <div className='flex flex-col'>
                <span className='text-base font-semibold'>
                  Lacak Pengiriman
                </span>
                {data?.data && (
                  <div className='mt-2 text-xs text-muted-foreground space-y-1'>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium text-[12px] text-muted-foreground'>
                        Kurir
                      </span>
                      <span className='text-[12px] text-foreground'>
                        {courier}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium text-[12px] text-muted-foreground'>
                        Resi
                      </span>
                      <span className='text-[12px] text-foreground break-all'>
                        {airwayBill}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {data?.data && (
              <div className='text-righ mr-4'>
                <div className='text-sm text-foreground font-semibold break-words'>
                  {data.data.invoice_no}
                </div>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className='flex flex-row flex-1 overflow-hidden'>
          <div className='flex-1 p-6 overflow-y-auto'>
            {isLoading && (
              <div className='text-sm text-muted-foreground'>
                Memuat pelacakan…
              </div>
            )}
            {isError && (
              <div className='text-sm text-red-600'>
                {error?.message || 'Gagal memuat data pelacakan.'}
              </div>
            )}
            {!isLoading && !isError && history.length === 0 && (
              <div className='text-sm text-muted-foreground'>
                Data pelacakan belum tersedia.
              </div>
            )}
            {!isLoading && !isError && history.length > 0 && (
              <div className='space-y-4'>
                {history.map((item, index) => {
                  const isActive = index === resolvedActiveIndex;
                  const { time, date } = formatDateParts(item.date);
                  return (
                    <div key={`${item.code}-${index}`} className='flex gap-4'>
                      <div className='flex flex-col items-center'>
                        <div
                          className={`w-3 h-3 rounded-full transition-all ${
                            isActive
                              ? 'bg-brand ring-4 ring-purple-100'
                              : 'bg-gray-300'
                          }`}
                        />
                        {index < history.length - 1 && (
                          <div
                            className={`w-0.5 h-12 mt-2 ${
                              isActive ? 'bg-brand' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>

                      {/* Event Content */}
                      <div className='flex-1 pt-0.5'>
                        <div className='flex items-start justify-between gap-2'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-1'>
                              <span className='text-sm font-semibold text-foreground'>
                                {time}
                              </span>
                              <span className='text-xs text-muted-foreground'>
                                {date}
                              </span>
                            </div>
                            <p
                              className={`text-sm mb-1 ${
                                isActive
                                  ? 'text-brand font-semibold'
                                  : 'text-foreground'
                              }`}
                            >
                              {item.desc}
                            </p>
                            <p className='text-xs text-muted-foreground'>
                              Status: {item.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
