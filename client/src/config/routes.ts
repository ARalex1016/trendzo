export const ROUTES = {
  HOME: "/",

  PRODUCTS: "/products",

  // Customer
  PROFILE: "/profile",

  PRODUCT_DETAILS: (slug: string = ":productSlug") => `/products/${slug}`,

  CART: "/cart",
  CHECKOUT: "/checkout",
  CHECKOUT_SUCCESS: (slug: string = ":orderNumber") =>
    `/checkout/success/${slug}`,

  MYORDERS: "/myorders",
  MYORDER_DETAILS: (slug: string = ":orderNumber") => `/myorders/${slug}`,

  MYREFERRAL: "/myreferrals",

  WALLET: "/wallet",

  WITHDRAW: "/wallet/withdraw",

  // Admin
  PRODUCT_MANAGEMENT: "/products-management",
  ALL_PRODUCTS: "/products-management/all",
  ADD_PRODUCTS: "/products-management/add",

  ORDER_MANAGEMENT: "/orders-management",
  ADMIN_ORDER_DETAILS: (slug: string = ":orderNumber") =>
    `/orders-management/${slug}`,

  USER_MANAGEMENT: "/users-management",

  // Attributes
  CATEGORY: "/attributes/category",
  SIZE: "/attributes/sizes",

  // Marketing
  COUPONS: "/marketing/coupons",

  // Guest
  LOGIN: "/login",
  SIGNUP: "/signup",

  NOT_FOUND: "*",
};
