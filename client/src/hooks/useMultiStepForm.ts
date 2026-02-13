import { useState } from "react";

interface Step {
  id: string;
  label: string;
  component: (props?: any) => React.ReactNode;
  schema: any;
}

interface UseMultiStepFormProps {
  steps: Step[];
  initialStep?: number; // ✅ NEW
}

export const useMultiStepForm = ({
  steps,
  initialStep = 0,
}: UseMultiStepFormProps) => {
  const safeInitialStep =
    initialStep >= 0 && initialStep < steps.length ? initialStep : 0;

  const [currentStepIndex, setCurrentStepIndex] =
    useState<number>(safeInitialStep);

  const next = () => {
    setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const back = () => {
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goTo = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  };

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    next,
    back,
    goTo,
  };
};
