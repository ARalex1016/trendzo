export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAILS: (slug: string = ":productSlug") => `/products/${slug}`,

  CART: "/cart",
  CHECKOUT: "/checkout",
  CHECKOUT_SUCCESS: (slug: string = ":orderNumber") =>
    `/checkout/success/${slug}`,

  MYORDERS: "/myorders",
  MYORDER_DETAILS: (slug: string = ":orderNumber") => `/myorders/${slug}`,

  PROFILE: "/profile",

  // Admin
  PRODUCT_MANAGEMENT: "/products-management",
  ALL_PRODUCTS: "/products-management/all",
  ADD_PRODUCTS: "/products-management/add",

  LOGIN: "/login",
  SIGNUP: "/signup",

  NOT_FOUND: "*",
};
