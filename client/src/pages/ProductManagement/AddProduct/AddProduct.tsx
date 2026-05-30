import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
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
import { Separator } from "@/components/ui/separator";

// Stepper
import { Stepper, MobileStepper } from "./Stepper/Stepper";

// data
import { steps } from "./data";

// Hooks
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useResponsive } from "@/hooks/use-mobile";

// Store
import useAuthStore from "@/store/useAuthStore";

// Validations
import {
  registerSchema,
  type UserRegisterType,
} from "@/validations/user.validator";

const AddProduct = () => {
  const { registerUser } = useAuthStore();

  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);

  const { step, currentStepIndex, isFirstStep, isLastStep, next, back } =
    useMultiStepForm({ steps });

  const { width } = useResponsive();

  const methods = useForm<UserRegisterType>({
    resolver: zodResolver(isLastStep ? registerSchema : step.schema) as any,
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
    ) as (keyof UserRegisterType)[];

    const isValid = await methods.trigger(currentStepFields);

    if (isValid) next();

    next();
  };

  const onSubmit = async (userData: UserRegisterType) => {
    setIsRegistering(true);
    try {
      await registerUser(userData);

      // ✅ Clear persisted draft
      localStorage.removeItem("signup-draft");

      localStorage.removeItem("ref");

      // ✅ Optional: reset form state
      methods.reset();

      // ✅ Redirect after success
      navigate("/products");
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
      <Card className="flex-1">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="w-full h-full flex flex-col"
          >
            <CardTitle className="col-span-2 flex flex-row gap-x-2 items-center px-side-spacing mb-3">
              {Icon && <Icon />}
              <span>{step.label}</span>
            </CardTitle>

            <Separator />

            <div className="flex-1 w-full px-side-spacing py-3">
              <StepComponent />
            </div>

            <Separator />

            {/* Action Button */}
            <CardFooter className="col-span-2 justify-end gap-x-2 px-side-spacing pt-3">
              {/* Pre Button */}
              {!isFirstStep && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={back}
                  disabled={isRegistering}
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
                  Next
                </Button>
              )}

              {/* Sign up Button */}
              {isLastStep && (
                <Button
                  type="submit"
                  disabled={isRegistering}
                  className="relative"
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
