import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Title, BaseText } from "@/components/Text";
import OrderSummary from "./OrderSummary";

// Components // Steps
import UserInfoStep from "./Steps/UserInfoStep";
import AddressInfoStep from "./Steps/AddressInfoStep";
import PaymentInfoStep from "./Steps/PaymentInfoStep";
import ReviewInfoStep from "./Steps/ReviewInfoStep";

// Schema
import {
  userStepSchema,
  addressStepSchema,
  paymentStepSchema,
  checkoutSchema,
} from "@/validations/checkout.validator";
import { type CheckoutSchemaType } from "@/validations/checkout.validator";

// Icons
import {
  Check,
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  ClipboardList,
} from "lucide-react";

// Hooks
import { useMultiStepForm } from "@/hooks/useMultiStepForm";

// Types
import { type Step } from "@/hooks/useMultiStepForm";

// Store
import useOrderStore from "@/store/useOrderStore";

const CHECKOUT_DRAFT_EXPIRY_MINUTES = 30;
const CHECKOUT_DRAFT_EXPIRY_MS = CHECKOUT_DRAFT_EXPIRY_MINUTES * 60 * 1000;

const steps: Step[] = [
  {
    id: "userDetails",
    label: "User Details",
    text: "Sign up to complete your order",
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
    label: "Review",
    text: "Review your details before placing the orderr",
    icon: ClipboardList,
    component: ReviewInfoStep,
    schema: checkoutSchema,
  },
];

function getValidCheckOutDraft() {
  try {
    const raw = localStorage.getItem("checkout-draft");

    if (!raw) return null;

    const draft = JSON.parse(raw);

    if (!draft?.savedAt) {
      localStorage.removeItem("checkout-draft");
      return null;
    }

    const isExpired = Date.now() - draft.savedAt > CHECKOUT_DRAFT_EXPIRY_MS;

    if (isExpired) {
      localStorage.removeItem("checkout-draft");
      return null;
    }

    return draft;
  } catch {
    localStorage.removeItem("checkout-draft");
    return null;
  }
}

const CheckOut = () => {
  const navigate = useNavigate();

  const { placeOrder } = useOrderStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const draft = React.useMemo(() => getValidCheckOutDraft(), []);

  const initialStepIndex = draft?.stepIndex >= 0 ? draft.stepIndex : 0;

  const { step, currentStepIndex, isFirstStep, isLastStep, next, back } =
    useMultiStepForm({ steps, initialStep: initialStepIndex });

  const defaultValues: CheckoutSchemaType = draft?.data ?? {
    user: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
    },
    address: {
      label: "",
      name: "",
      phone: "",
      email: "",
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    paymentMethod: "cod",
    orderNote: "",
    couponCode: "",
    selectedAddressId: undefined,
    addressMode: "saved",
  };

  const methods = useForm<CheckoutSchemaType>({
    resolver: zodResolver(isLastStep ? checkoutSchema : step.schema) as any,
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldUnregister: false, // important for multi-step forms
    criteriaMode: "firstError", // ✅ IMPORTANT
    shouldFocusError: true, // ✅ Focus first invalid field
    defaultValues,
  });

  const watchedValues = useWatch({
    control: methods.control,
  });

  const isCheckoutFormValid = checkoutSchema.safeParse(watchedValues).success;

  const canPlaceOrder = isCheckoutFormValid && !isCheckingOut;

  let StepComponent = step.component;
  let Icon = step.icon;

  const handleNext = async () => {
    const currentStepFields = Object.keys(
      steps[currentStepIndex].schema.shape,
    ) as (keyof CheckoutSchemaType)[];

    const isValid = await methods.trigger(currentStepFields);

    if (isValid) next();

    next();
  };

  const onSubmit = async (checkOutData: CheckoutSchemaType) => {
    setIsCheckingOut(true);
    try {
      await placeOrder(checkOutData);

      // ✅ Clear persisted draft
      localStorage.removeItem("checkout-draft");

      // ✅ Optional: reset form state
      methods.reset();

      // ✅ Redirect after success
      // navigate("/products");
    } catch (error: any) {
    } finally {
      setIsCheckingOut(false);
    }
  };

  useEffect(() => {
    const subscription = methods.watch((value) => {
      const draft = {
        data: value,
        stepIndex: currentStepIndex,
        savedAt: Date.now(),
      };

      localStorage.setItem("checkout-draft", JSON.stringify(draft));
    });
    return () => subscription.unsubscribe();
  }, [methods, currentStepIndex]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 xs:gap-y-5 px-side-spacing py-4">
      {/* Back to Cart Button */}
      <div>
        <Button
          variant={"secondary"}
          onClick={() => navigate("/cart")}
          className="text-xs text-foreground/60 hover:text-foreground gap-x-1! pl-0!"
        >
          <ArrowLeft />

          <span>Back to Cart</span>
        </Button>
      </div>

      {/* Title */}
      <div className="col-span-full">
        <Title text="Checkout" />
        <BaseText>Complete your purchase securely</BaseText>
      </div>

      {/* Stepper */}
      <div className="col-span-full flex items-center w-full gap-1 my-2">
        {steps?.map((step, index) => {
          const isCompleted = currentStepIndex > index;
          const isCurrent = currentStepIndex === index;

          const bgColor = isCompleted
            ? "bg-blue-700"
            : isCurrent
              ? "bg-blue-600"
              : "bg-muted";

          return (
            <React.Fragment key={step.id}>
              {/* Indicator */}
              <div
                className={`size-8 sm:size-10 rounded-full flex justify-center items-center ${bgColor}`}
              >
                {currentStepIndex > index ? (
                  <Check className="size-4" />
                ) : (
                  <p className="text-sm text-white font-medium">{index + 1}</p>
                )}
              </div>

              {/* Seperator */}
              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 rounded-sm opacity-75 ${
                    isCompleted ? "bg-blue-600" : "bg-muted"
                  }`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <Card className="lg:col-span-2 w-full! h-fit gap-0 py-6! mb-4">
        <CardHeader className="flex flex-row items-center">
          {Icon && (
            <div className="size-8 bg-primary rounded-full flex justify-center items-center">
              <Icon size={18} className="" />
            </div>
          )}

          <CardTitle className="text-lg">{step.label}</CardTitle>
        </CardHeader>

        <CardContent className="w-full py-2">
          {step.text && <p className="text-foreground/60">{step.text}</p>}

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              // className="flex flex-col gap-y-4"
            >
              <StepComponent />

              {/* Action Button */}
              <CardFooter className="col-span-2 justify-end gap-x-2 px-0">
                {/* Pre Button */}
                {!isFirstStep && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={back}
                    disabled={isCheckingOut}
                    // className="px-5"
                  >
                    Prev
                  </Button>
                )}

                {/* Next Button */}
                {!isLastStep && (
                  <Button
                    type="button"
                    // variant="destructive"
                    onClick={handleNext}
                    // className="text-white font-medium bg-red-500 px-5 py-1 rounded-sm"
                  >
                    Continue
                  </Button>
                )}

                {/* Sign up Button */}
                {isLastStep && (
                  <Button
                    type="submit"
                    disabled={isCheckingOut}
                    className="relative"
                  >
                    <span
                      className={isCheckingOut ? "opacity-0" : "opacity-100"}
                    >
                      Place Order
                    </span>

                    {/* Spinner */}
                    {isCheckingOut && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Spinner className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                )}
              </CardFooter>
            </form>
          </FormProvider>
        </CardContent>

        {/* <CardFooter className="flex justify-center items-center"></CardFooter> */}
      </Card>

      <OrderSummary
        onCheckout={methods.handleSubmit(onSubmit)}
        disabled={!canPlaceOrder}
        className="lg:col-span-1"
      />
    </div>
  );
};

export default CheckOut;
