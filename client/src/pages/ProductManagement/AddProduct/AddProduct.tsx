import { useState, useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { PageShell } from "@/components/Container";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";

// Stepper
import { ResponsiveStepper } from "./Stepper/Stepper";

// Icons
import { ChevronRight, ChevronLeft } from "lucide-react";

// data
import { steps } from "./data";

// Hooks
import { useMultiStepForm } from "@/hooks/useMultiStepForm";

// Store
import useProductStore from "@/store/useProductStore";

// Validations
import {
  addProductSchema,
  type AddProductType,
} from "@/validations/product.validator";

const AddProduct = () => {
  const { addProduct } = useProductStore();

  const [isCreating, setIsCreating] = useState(false);

  const { step, currentStepIndex, isFirstStep, isLastStep, next, back, goTo } =
    useMultiStepForm({ steps });

  const methods = useForm<AddProductType>({
    resolver: zodResolver(addProductSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldUnregister: false, // important for multi-step forms
    criteriaMode: "firstError", // ✅ IMPORTANT
    shouldFocusError: true, // ✅ Focus first invalid field
    defaultValues: {
      images: [],
      colors: [],
      sizes: [],
      inventory: [],
      categories: [],
      featured: false,
      isActive: true,
    },
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
    setIsCreating(true);

    try {
      await addProduct(productData);

      // ✅ Optional: reset form state
      // methods.reset();
    } catch (error: any) {
    } finally {
      setIsCreating(false);
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
      <ResponsiveStepper
        steps={steps}
        currentStepIndex={currentStepIndex}
        goTo={goTo}
      />

      {/* Content */}
      <Card className="flex-1 min-w-0 h-fit">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit, (errors) => {
              console.log("FORM ERRORS:", errors);
            })}
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

            <div className="max-w-full px-side-spacing py-5">
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
                  disabled={isCreating}
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

              {/* Create Product Button */}
              {isLastStep && (
                <Button
                  type="submit"
                  // disabled={isCreating}
                  className="relative bg-primary-gradient hover:scale-105"
                >
                  {/* Text */}
                  <span className={isCreating ? "opacity-0" : "opacity-100"}>
                    Create Product
                  </span>

                  {/* Spinner */}
                  {isCreating && (
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
