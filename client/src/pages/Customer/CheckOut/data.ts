// Components // Steps
import UserInfoStep from "./Steps/UserInfoStep";
import AddressInfoStep from "./Steps/AddressInfoStep";
import PaymentInfoStep from "./Steps/PaymentInfoStep";
import ReviewInfoStep from "./Steps/ReviewInfoStep";
// import CheckoutAuthGuard from "./GuestCheckout";

// Schema
import {
  userStepSchema,
  addressStepSchema,
  paymentStepSchema,
  checkoutSchema,
} from "@/validations/checkout.validator";

// Icons
import { User, MapPin, CreditCard, ClipboardList } from "lucide-react";

// Types
import type { Step } from "@/hooks/useMultiStepForm";

export const steps: Step[] = [
  {
    id: "userDetails",
    label: "User Details",
    // text: "Sign up to complete your order",
    icon: User,
    component: UserInfoStep,
    schema: userStepSchema,
  },
  {
    id: "address",
    label: "Delivery Address",
    text: "Select or add a delivery address",
    icon: MapPin,
    component: AddressInfoStep,
    schema: addressStepSchema,
  },
  {
    id: "payment",
    label: "Payment",
    text: "Choose your payment method",
    icon: CreditCard,
    component: PaymentInfoStep,
    schema: paymentStepSchema,
  },
  {
    id: "review",
    label: "Review Your Order",
    text: "Review your details before placing the orderr",
    icon: ClipboardList,
    component: ReviewInfoStep,
    schema: checkoutSchema,
  },
];
