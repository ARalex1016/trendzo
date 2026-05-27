import React from "react";

// Lib
import { cn } from "@/lib/utils";

// Icons
import { Check } from "lucide-react";

// Types
import type { Step } from "@/hooks/useMultiStepForm";

interface StepperProps {
  steps: Step[];
  currentStepIndex: number;
}

export const Stepper = ({
  steps,
  currentStepIndex,
  // completed,
  // onSelect,
}: StepperProps) => {
  return (
    <nav className="w-fit glass-panel rounded-3xl p-3 lg:sticky lg:top-6">
      <div className="px-3 pt-2 pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          New Product
        </p>
      </div>
      <ol className="relative flex flex-col gap-0.5">
        <span
          aria-hidden
          className="absolute left-6.5 top-3 bottom-3 w-px bg-linear-to-b from-border via-border/40 to-transparent"
        />
        {steps.map((step, index) => {
          const isCompleted = currentStepIndex > index;
          const isActive = currentStepIndex === index;

          const Icon = step.icon;

          return (
            <li key={step.id} className="relative">
              <button
                type="button"
                // onClick={() => onSelect(step.id)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition-all pr-12",
                  isActive ? "bg-white/4" : "hover:bg-white/3",
                )}
              >
                <span
                  className={cn(
                    "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xs font-semibold transition-all",
                    isActive &&
                      "border-transparent bg-linear-to-br from-neon-purple to-neon-blue text-white shadow-[0_0_24px_-4px_var(--neon-purple)] animate-glow-pulse",
                    isCompleted &&
                      !isActive &&
                      "border-success/40 bg-success/10 text-success",
                    !isActive &&
                      !isCompleted &&
                      "border-border bg-surface text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {isCompleted && !isActive ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : Icon ? (
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-medium tabular-nums",
                        isActive
                          ? "text-neon-cyan"
                          : "text-muted-foreground/70",
                      )}
                    >
                      0{index + 1}
                    </span>
                    <span
                      className={cn(
                        "truncate text-sm font-medium transition-colors",
                        isActive ? "text-foreground" : "text-foreground/80",
                      )}
                    >
                      {step.label}
                    </span>
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {step.text}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export const MobileStepper = ({ steps, currentStepIndex }: StepperProps) => {
  return (
    <div className="flex items-center w-full gap-1 my-5">
      {steps?.map((step, index) => {
        const isCompleted = currentStepIndex > index;
        const isActive = currentStepIndex === index;

        const bgColor = isCompleted
          ? "bg-blue-700"
          : isActive
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
  );
};
