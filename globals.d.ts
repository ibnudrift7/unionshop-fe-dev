// Allow importing global CSS (side-effect only) without TypeScript error TS2882.
// Next.js handles these at build time.
declare module '*.css';

// Midtrans Snap typings
interface SnapPayOptions {
  onSuccess?: (result?: unknown) => void;
  onPending?: (result?: unknown) => void;
  onError?: (error?: unknown) => void;
  onClose?: () => void;
}

interface MidtransSnap {
  pay: (token: string, options?: SnapPayOptions) => void;
}

declare global {
  interface Window {
    snap?: MidtransSnap;
  }
}

export {};
