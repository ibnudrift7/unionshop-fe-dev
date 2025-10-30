export interface ApiResponseMeta {
  statusCode: number;
  message: string;
  success: boolean;
}

export interface OrderListItem {
  id: number;
  invoice_no: string;
  status_name: string;
  payment_status: string;
  final_amount: string;
  created_at: string;
  total_items: number;
  first_product: { product_name: string; image: string } | null;
}

export interface OrderListPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface OrderListResponse extends ApiResponseMeta {
  data: {
    data: OrderListItem[];
    pagination: OrderListPagination;
  };
}

export interface OrderItemDetailAttribute {
  name: string;
  price: number;
  value: string;
}

export interface OrderItemDetail {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  product_weight: number;
  quantity: number;
  price: string;
  sale_price: number;
  subtotal: string;
  attributes: OrderItemDetailAttribute[];
  product_image: string | null;
}

export interface OrderStatusHistoryItem {
  id: number;
  status_name: string;
  changed_at: string;
  notes: string;
}

export interface OrderDetailData {
  id: number;
  invoice_no: string;
  status_name: string;
  created_at: string;
  items: OrderItemDetail[];
  status_history: OrderStatusHistoryItem[];
  [key: string]: unknown;
}

export interface OrderDetailResponse extends ApiResponseMeta {
  data: OrderDetailData;
}

// Updated shipment history types per new API
export interface OrderHistoryItem {
  stage: string;
  status_ids: number[];
  label: string;
  completed: boolean;
  active: boolean;
}

export interface OrderHistoryResponse extends ApiResponseMeta {
  data: {
    order_id: number;
    invoice_no: string;
    current_status_id: number;
    shipping_progress: OrderHistoryItem[];
  };
}

export interface CreateOrderReviewPayload {
  product_id: number;
  rating: number;
  review: string;
}

export interface CreateOrderReviewResponse extends ApiResponseMeta {
  data: {
    id: number;
    product_id: number;
    rating: number;
    review: string;
    created_at: string;
    product_name: string;
    product_slug: string;
    product_image: string;
  };
}

export interface OrderReviewsResponse extends ApiResponseMeta {
  data: {
    order_id: number;
    invoice_no: string;
    reviewed_products: Array<{
      id: number;
      product_id: number;
      rating: number;
      review: string;
      created_at: string;
      product_name: string;
      product_slug: string;
      product_image: string;
    }>;
    pending_review_products: Array<{
      product_id: number;
      product_name: string;
      product_slug: string;
      product_image: string | null;
    }>;
  };
}
