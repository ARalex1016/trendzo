import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { PageShell } from "@/components/Container";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";

// Stepper
import { Stepper, MobileStepper } from "./Stepper/Stepper";

// Icons
import { ChevronRight, ChevronLeft } from "lucide-react";

// data
import { steps } from "./data";

// Hooks
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useResponsive } from "@/hooks/use-mobile";

// Store
import useProductStore from "@/store/useProductStore";

// Validations
import {
  addProductSchema,
  type AddProductType,
} from "@/validations/product.validator";

const AddProduct = () => {
  const { addProduct } = useProductStore();

  const [isRegistering, setIsRegistering] = useState(false);

  const { step, currentStepIndex, isFirstStep, isLastStep, next, back } =
    useMultiStepForm({ steps });

  const { width } = useResponsive();

  const methods = useForm<AddProductType>({
    resolver: zodResolver(isLastStep ? addProductSchema : step.schema) as any,
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldUnregister: false, // important for multi-step forms
    criteriaMode: "firstError", // ✅ IMPORTANT
    shouldFocusError: true, // ✅ Focus first invalid field
    defaultValues: {},
  });

  let Icon = step.icon;

  let StepComponent = step.component;

  const handleNext = async () => {
    const currentStepFields = Object.keys(
      steps[currentStepIndex].schema.shape,
    ) as (keyof AddProductType)[];

    const isValid = await methods.trigger(currentStepFields);

    if (isValid) next();

    next();
  };

  const onSubmit = async (productData: AddProductType) => {
    setIsRegistering(true);
    try {
      await addProduct(productData);

      // ✅ Optional: reset form state
      methods.reset();
    } catch (error: any) {
    } finally {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    const subscription = methods.watch((value) => {
      const draft = {
        data: value,
        stepIndex: currentStepIndex,
        savedAt: Date.now(),
      };

      localStorage.setItem("signup-draft", JSON.stringify(draft));
    });
    return () => subscription.unsubscribe();
  }, [methods, currentStepIndex]);

  return (
    <PageShell className="flex flex-col lg:flex-row gap-5">
      {width >= 1024 ? (
        <Stepper steps={steps} currentStepIndex={currentStepIndex} />
      ) : (
        <MobileStepper steps={steps} currentStepIndex={currentStepIndex} />
      )}

      {/* Content */}
      <Card className="flex-1 h-fit">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="w-full h-full flex flex-col"
          >
            <CardHeader className="flex flex-row items-center gap-x-2 px-side-spacing mb-3">
              {Icon && (
                <div className="bg-primary-gradient rounded-full p-2">
                  <Icon className="size-5" />
                </div>
              )}

              <div className="space-y-1">
                <CardTitle>{step.label}</CardTitle>

                <p className="text-sm text-foreground/60">{step.text}</p>
              </div>
            </CardHeader>

            <Separator />

            <div className="w-full px-side-spacing py-5">
              <StepComponent />
            </div>

            <Separator />

            {/* Action Button */}
            <CardFooter className="col-span-2 justify-end gap-x-3 px-side-spacing pt-3">
              {/* Pre Button */}
              {!isFirstStep && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={back}
                  disabled={isRegistering}
                  className="hover:scale-105"
                >
                  <ChevronLeft />
                  <span>Prev</span>
                </Button>
              )}

              {/* Next Button */}
              {!isLastStep && (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-primary-gradient hover:scale-105"
                >
                  <span>Next</span>
                  <ChevronRight />
                </Button>
              )}

              {/* Sign up Button */}
              {isLastStep && (
                <Button
                  type="submit"
                  disabled={isRegistering}
                  className="relative bg-primary-gradient hover:scale-105"
                >
                  {/* Text */}
                  <span className={isRegistering ? "opacity-0" : "opacity-100"}>
                    Create Product
                  </span>

                  {/* Spinner */}
                  {isRegistering && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Spinner className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              )}
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </PageShell>
  );
};

export default AddProduct;
