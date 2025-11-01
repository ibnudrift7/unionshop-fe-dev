export interface ApplyPromoData {
  promo_id: number;
  promo_code: string;
  promo_name: string;
  discount_type: string;
  discount_value: string;
  discount_amount: string;
  subtotal: string;
  total_after_discount: string;
}

export interface ApplyPromoResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: ApplyPromoData;
}

export interface ApplyPromoErrorResponse {
  success: false;
  message: string;
  errors?: {
    promo_code?: string;
    [key: string]: unknown;
  };
}

// Voucher banners and modal types
import type { PromotionItem } from './promotion';

export interface InlineVoucherModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  subtitle?: string;
  description?: string;
  promotions?: PromotionItem[] | null;
  loadingPromotions?: boolean;
  selectedCode?: string;
}

export interface Voucher1Props {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  onClaim?: () => void;
}

export interface Voucher2Props {
  title1: string;
  title2?: string;
  description: string;
  buttonText: string;
  image: string;
  onClaim?: () => void;
  code?: string;
}

export interface VoucherBannersSectionProps {
  voucher1: Voucher1Props;
  vouchers: Voucher2Props[];
  className?: string;
}
