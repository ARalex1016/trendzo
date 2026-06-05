// Components
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

// Lib
import { cn } from "@/lib/utils";

// Hooks
import { useResponsive } from "@/hooks/use-mobile";

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
  const { breakpoint } = useResponsive();

  var Filter_Width: string;

  let padding_top = 16;

  if (breakpoint === "xs" || breakpoint === "sm") {
    Filter_Width = "288px";
  } else if (breakpoint === "md" || breakpoint === "lg") {
    Filter_Width = "250px";
  } else {
    Filter_Width = "288px";
  }

  return (
    <Card
      className="self-start bg-sidebar rounded-xl border border-border flex flex-col gap-y-2 px-6 py-5 sticky top-menu-height"
      style={{
        width: Filter_Width,
        height: `calc(100svh - var(--menu-height) - ${padding_top * 2}px)`,
        top: `calc(var(--menu-height) + ${padding_top}px)`,
      }}
    >
      <CardTitle className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground px-3 pt-2 pb-2">
        New Product
      </CardTitle>

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
                      "border-primary bg-primary-gradient text-foreground shadow-[0_0_24px_-4px_var(--neon-purple)] animate-glow-pulse",
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
    </Card>
  );
};

export function MobileStepper({
  steps,
  currentStepIndex,
  // completed,
  // onSelect,
}: StepperProps) {
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  return (
    <Card className="w-full flex flex-col gap-y-0 glass-panel rounded-2xl p-3 lg:hidden">
      <div className="flex items-center justify-between px-1 pb-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Step {currentStepIndex + 1} / {steps.length}
          </p>
          {/* <p className="text-sm font-semibold">
            {steps[currentStepIndex]?.label}
          </p> */}
        </div>
        <p className="text-xs text-muted-foreground tabular-nums">
          {Math.round(progress)}%
        </p>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-linear-to-r from-neon-purple via-neon-blue to-neon-cyan transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const isCompleted = currentStepIndex > index;
          const isActive = currentStepIndex === index;

          // const Icon = step.icon;

          return (
            <button
              key={step.id}
              // onClick={() => onSelect(s.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all",
                isActive &&
                  "border-neon-purple/60 bg-neon-purple/15 text-foreground",
                isCompleted &&
                  !isActive &&
                  "border-success/30 bg-success/10 text-success",
                !isActive &&
                  !isCompleted &&
                  "border-border bg-surface text-muted-foreground",
              )}
            >
              <span className="tabular-nums">{index + 1}</span>
              <span className="font-medium">{step.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
