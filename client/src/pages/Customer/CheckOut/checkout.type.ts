export type PaymentMethod = "bank" | "esewa" | "khalti" | "cod";

export type CheckoutItem = {
  product: string;
  color: string;
  size: string;
  quantity: number;

  // UI-only fields for review summary
  title?: string;
  image?: string;
  colorName?: string;
  sizeName?: string;
  unitPrice?: number;
};

export type AddressFormType = {
  label?: string;
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  country?: string;
  postalCode: string;
};

export type LoginFormType = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
};

export type CheckoutFormType = {
  login: LoginFormType;
  address: AddressFormType;
  paymentMethod: PaymentMethod;
  orderNote?: string;
  couponCode?: string;
};

export type PlaceOrderPayload = {
  items: {
    product: string;
    color: string;
    size: string;
    quantity: number;
  }[];
  paymentMethod: PaymentMethod;
  deliveryAddress: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postalCode?: string;
    country?: string;
  };
  orderNote?: string;
  couponCode?: string;
};

export type CheckoutStepId = "login" | "address" | "payment" | "review";
