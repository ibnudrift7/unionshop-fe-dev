export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export const API_ENDPOINTS = {
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  profile: '/user/profile',
  profilePassword: '/user/profile/password',
  addressCreate: '/user/address',
  products: '/products',
  cart: '/cart',
  cartItems: '/cart/items',
  cartClear: '/cart/clear',
  addressDefault: '/user/address/default',
  locationProvinces: '/location/provinces',
  locationCities: '/location/cities',
  locationDistricts: '/location/districts',
  shippingCouriers: '/shipping/couriers',
  shippingCalculate: '/shipping/calculate',
  checkout: '/checkout',
  checkoutApplyPromo: '/checkout/apply-promo',
  orders: '/user/order',
  orderDetail: '/user/order',
  orderShipmentHistory: '/user/order',
  orderCreateReview: '/user/order',
  orderReviews: '/user/order',
  webhookOrderStatus: '/webhooks/order-status',
} as const;
