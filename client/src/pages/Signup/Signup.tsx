import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import BasicInfoStep, { basicInfoStepSchema } from "./BasicInfoStep";
import SecurityStep, { securityStepSchema } from "./SecurityStep";
import AddressStep, { addressStepSchema } from "./AddressStep";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// Icons
import { Check } from "lucide-react";

// Hooks
import { useMultiStepForm } from "@/hooks/useMultiStepForm";

// Store
import useAuthStore from "@/store/useAuthStore";

// Validations
import {
  registerSchema,
  type UserRegisterType,
} from "@/validations/user.validator";

const SIGNUP_DRAFT_EXPIRY_MINUTES = 30;
const SIGNUP_DRAFT_EXPIRY_MS = SIGNUP_DRAFT_EXPIRY_MINUTES * 60 * 1000;

function getValidSignupDraft() {
  try {
    const raw = localStorage.getItem("signup-draft");
    if (!raw) return null;

    const draft = JSON.parse(raw);

    if (!draft?.savedAt) {
      localStorage.removeItem("signup-draft");
      return null;
    }

    const isExpired = Date.now() - draft.savedAt > SIGNUP_DRAFT_EXPIRY_MS;

    if (isExpired) {
      localStorage.removeItem("signup-draft");
      return null;
    }

    return draft;
  } catch {
    localStorage.removeItem("signup-draft");
    return null;
  }
}

const Signup = () => {
  const { registerUser } = useAuthStore();

  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);

  const steps = [
    {
      id: "basic",
      label: "Basic Info",
      component: BasicInfoStep,
      schema: basicInfoStepSchema,
    },
    {
      id: "security",
      label: "Security",
      component: SecurityStep,
      schema: securityStepSchema,
    },
    {
      id: "address",
      label: "Address",
      component: AddressStep,
      schema: addressStepSchema,
    },
  ];

  const draft = getValidSignupDraft();

  const initialStepIndex = draft?.stepIndex >= 0 ? draft.stepIndex : 0;

  const { step, currentStepIndex, isFirstStep, isLastStep, next, back } =
    useMultiStepForm({ steps, initialStep: initialStepIndex });

  const referral = localStorage.getItem("ref") ?? undefined;

  const methods = useForm<UserRegisterType>({
    resolver: zodResolver(isLastStep ? registerSchema : step.schema) as any,
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldUnregister: false, // important for multi-step forms
    criteriaMode: "firstError", // ✅ IMPORTANT
    shouldFocusError: true, // ✅ Focus first invalid field
    defaultValues: {
      address: { country: "Nepal" },
      referralCode: draft?.data?.referralCode ?? referral,
      ...(draft?.data || {}),
    },
  });

  let StepComponent = step.component;

  const handleNext = async () => {
    const currentStepFields = Object.keys(
      steps[currentStepIndex].schema.shape,
    ) as (keyof UserRegisterType)[];

    const isValid = await methods.trigger(currentStepFields);

    if (isValid) next();

    // next();
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
    <div className="w-full h-full flex justify-center items-center">
      <Card className="w-full max-w-sm gap-0">
        <CardHeader>
          <CardTitle className="text-center">Create a new account</CardTitle>

          {/* Stepper */}
          <div className="flex items-center w-full gap-1 my-5">
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
                    className={`size-5 rounded-full flex justify-center items-center ${bgColor}`}
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
        </CardHeader>

        <CardContent>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              // className="flex flex-col gap-y-4"
              className="grid grid-cols-2 gap-x-2 gap-y-4"
            >
              {/* <CardTitle className="col-span-2">{step.label}</CardTitle> */}

              <StepComponent />

              {/* Action Button */}
              <CardFooter className="col-span-2 justify-end gap-x-2 px-0">
                {/* Pre Button */}
                {!isFirstStep && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={back}
                    disabled={isRegistering}
                    // className="px-5"
                  >
                    Pre
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
                    <span
                      className={isRegistering ? "opacity-0" : "opacity-100"}
                    >
                      Sign up
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
        </CardContent>

        <CardFooter className="flex justify-center items-center">
          <p className="text-sm font-light">
            Already have an account?
            <Button
              className="font-bold px-1"
              variant="link"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
