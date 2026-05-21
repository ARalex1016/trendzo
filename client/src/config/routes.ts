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

  LOGIN: "/login",
  SIGNUP: "/signup",

  NOT_FOUND: "*",
};
