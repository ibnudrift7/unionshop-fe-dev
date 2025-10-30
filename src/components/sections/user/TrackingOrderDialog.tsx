'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';

interface TrackingEvent {
  id: string;
  time: string;
  date: string;
  status: string;
  location: string;
  courier: string;
  isActive: boolean;
}

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrderTrackingModal({
  isOpen,
  onClose,
}: OrderTrackingModalProps) {
  const trackingEvents: TrackingEvent[] = [
    {
      id: '1',
      time: '15:32',
      date: '21 May',
      status: 'Paket akan dikirimkan ke JBR_GATEWAY',
      location: 'JBR_GATEWAY',
      courier: 'J&T',
      isActive: true,
    },
    {
      id: '2',
      time: '14:51',
      date: '21 May',
      status: 'Paket telah sampai di GSK2_GATEWAY',
      location: 'GSK2_GATEWAY',
      courier: 'J&T',
      isActive: false,
    },
    {
      id: '3',
      time: '14:33',
      date: '21 May',
      status: 'Paket telah sampai di GSK2_GATEWAY',
      location: 'GSK2_GATEWAY',
      courier: 'J&T',
      isActive: false,
    },
    {
      id: '4',
      time: '08:35',
      date: '21 May',
      status: 'Paket akan dikirimkan ke GSK2_GATEWAY',
      location: 'GSK2_GATEWAY',
      courier: 'J&T',
      isActive: false,
    },
    {
      id: '5',
      time: '08:33',
      date: '21 May',
      status: 'Paket telah sampai di MDR_GATEWAY',
      location: 'MDR_GATEWAY',
      courier: 'J&T',
      isActive: false,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0'>
        {/* Header */}
        <DialogHeader className='border-b border-border px-6 py-4 flex flex-row items-center justify-between space-y-0'>
        </DialogHeader>

        <div className='flex flex-row flex-1 overflow-hidden'>
          <div className='flex-1 p-6 overflow-y-auto'>
            <div className='space-y-4'>
              {trackingEvents.map((event, index) => (
                <div key={event.id} className='flex gap-4'>
                  {/* Timeline Line and Dot */}
                  <div className='flex flex-col items-center'>
                    {/* Dot */}
                    <div
                      className={`w-3 h-3 rounded-full transition-all ${
                        event.isActive
                          ? 'bg-purple-600 ring-4 ring-purple-100'
                          : 'bg-gray-300'
                      }`}
                    />
                    {/* Line */}
                    {index < trackingEvents.length - 1 && (
                      <div
                        className={`w-0.5 h-12 mt-2 ${
                          event.isActive ? 'bg-purple-200' : 'bg-gray-200'
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
                            {event.time}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            {event.date}
                          </span>
                        </div>
                        <p
                          className={`text-sm mb-1 ${
                            event.isActive
                              ? 'text-purple-600 font-semibold'
                              : 'text-foreground'
                          }`}
                        >
                          {event.status}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Kurir: {event.courier}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
