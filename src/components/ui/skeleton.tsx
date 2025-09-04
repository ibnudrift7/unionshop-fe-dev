import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { CarouselItem } from '@/components/ui/carousel';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='skeleton'
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

function CategoryGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className='text-center bg-white rounded-lg shadow-lg p-2 sm:p-3 md:p-4'
        >
          <div className='w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-2'>
            <Skeleton className='w-full h-full rounded-full' />
          </div>
          <Skeleton className='h-3 w-16 mx-auto' />
        </div>
      ))}
    </>
  );
}

function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={`skeleton-${index}`} className='shadow-sm'>
          <CardContent className='p-3'>
            <div className='relative mb-2'>
              <Skeleton className='w-full h-24 rounded' />
            </div>
            <Skeleton className='h-4 w-3/4 mb-2' />
            <div className='flex flex-col space-y-2'>
              <Skeleton className='h-3 w-1/2' />
              <Skeleton className='h-3 w-2/3' />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

function SpecialTodayCarouselSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <CarouselItem
          key={`skeleton-${index}`}
          className='pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4'
        >
          <Card className='shadow-sm'>
            <CardContent className='p-3'>
              <div className='relative mb-2'>
                <Skeleton className='w-full h-20 rounded' />
              </div>
              <Skeleton className='h-4 w-3/4 mb-2' />
              <div className='flex flex-col space-y-1'>
                <Skeleton className='h-4 w-1/2' />
                <Skeleton className='h-3 w-2/3' />
              </div>
              <Skeleton className='h-3 w-4/5 mt-2' />
            </CardContent>
          </Card>
        </CarouselItem>
      ))}
    </>
  );
}

export {
  Skeleton,
  CategoryGridSkeleton,
  ProductGridSkeleton,
  SpecialTodayCarouselSkeleton,
};
