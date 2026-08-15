import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { PageShell } from "@/components/Container";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TitleTextContainer } from "@/components/Container";
import CheckoutAuthGuard from "./CheckoutAuthGuard";
import OrderSummary from "./OrderSummary";

// Schema
import { checkoutSchema } from "@/validations/checkout.validator";
import { type CheckoutSchemaType } from "@/validations/checkout.validator";

// Icons
import { Check } from "lucide-react";

// Hooks
import { useMultiStepForm } from "@/hooks/useMultiStepForm";

// data
import { steps } from "./data";

// Store
import useOrderStore from "@/store/useOrderStore";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";

const CheckOut = () => {
  const navigate = useNavigate();

  const { placeOrder } = useOrderStore();
  const { user } = useAuthStore();
  const { cart } = useCartStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const initialStepIndex = 0;

  const { step, currentStepIndex, isFirstStep, isLastStep, next, back } =
    useMultiStepForm({ steps, initialStep: initialStepIndex });

  const defaultValues: CheckoutSchemaType = {
    user: {
      fullName: "",
      phone: "",
      email: "",
    },
    deliveryAddress: {
      _id: "",
      label: "",
      fullName: "",
      phone: "",
      street: "",
      area: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      landmark: "",
    },
    paymentMethod: "cod",
    orderNote: "",
    couponCode: cart?.coupon && "",
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

  const formartOrderData = (checkOutData: CheckoutSchemaType) => {
    return {
      items: cart.items.map((item) => ({
        product: item.product,
        color: item.color._id,
        size: item.size._id,
        quantity: item.quantity,
      })),
      paymentMethod: checkOutData.paymentMethod,
      deliveryAddress: {
        id: checkOutData.deliveryAddress._id, // ✅ mapped
        name: checkOutData.deliveryAddress.fullName,
        phone: checkOutData.deliveryAddress.phone,
        address: [
          checkOutData.deliveryAddress.street,
          checkOutData.deliveryAddress.area,
          checkOutData.deliveryAddress.landmark,
        ]
          .filter(Boolean)
          .join(", "), // ✅ flattened

        city: checkOutData.deliveryAddress.city,
        postalCode: checkOutData.deliveryAddress.postalCode,
        country: checkOutData.deliveryAddress.country,
      },
      orderNote: checkOutData.orderNote || undefined,
      couponCode: checkOutData.couponCode || undefined,
    };
  };

  const handleNext = async () => {
    const currentStepFields = Object.keys(
      steps[currentStepIndex].schema.shape,
    ) as (keyof CheckoutSchemaType)[];

    const isValid = await methods.trigger(currentStepFields);

    if (isValid) next();

    // next();
  };

  const onSubmit = async (checkOutData: CheckoutSchemaType) => {
    setIsCheckingOut(true);
    try {
      let formatedOrderData = formartOrderData(checkOutData);

      let res = await placeOrder(formatedOrderData);

      // ✅ Optional: reset form state
      // methods.reset();

      // ✅ Redirect after success
      navigate(`/checkout/success/${res?.data?.orderNumber}`);
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
    <PageShell
      back="Back to Cart"
      to="/cart"
      className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 xs:gap-y-5"
    >
      {/* Title */}
      <TitleTextContainer title="Checkout" className="col-span-full">
        Complete your purchase securely
      </TitleTextContainer>

      {/* Stepper */}
      {!!user && (
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
                    <p className="text-sm text-white font-medium">
                      {index + 1}
                    </p>
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
      )}

      {!!user && (
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

          <CardFooter>
            {isLastStep && (
              <p className="w-full text-center text-[10px] xs:text-xs text-foreground/40">
                By placing the order, you confirm that the above information is
                correct and agree to our terms & conditions.
              </p>
            )}
          </CardFooter>
        </Card>
      )}

      {!user && <CheckoutAuthGuard />}

      <OrderSummary
        onCheckout={methods.handleSubmit(onSubmit)}
        disabled={!canPlaceOrder}
        className="lg:col-span-1"
      />
    </PageShell>
  );
};

export default CheckOut;
