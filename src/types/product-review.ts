export interface ProductReviewItem {
  id: number;
  rating: number;
  review: string;
  created_at: string;
  user_name: string;
  user_email?: string;
}

export interface ProductReviewStatistics {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Array<{
    rating: number;
    count: number;
  }>;
}

export interface ProductReviewPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ProductReviewsData {
  reviews: ProductReviewItem[];
  statistics: ProductReviewStatistics;
  pagination: ProductReviewPagination;
}

export interface ProductReviewsResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: ProductReviewsData;
}
