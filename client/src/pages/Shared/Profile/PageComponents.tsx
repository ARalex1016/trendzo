import type React from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Lib
import { cn } from "@/lib/utils";

// Types
import { CheckCircle2, AlertCircle, type LucideIcon } from "lucide-react";

interface InputFieldProps extends React.ComponentProps<"input"> {
  label: string;
  icon?: LucideIcon;
  iconClassName?: string;
  isVerified?: boolean;
}

interface ContainerProps
  extends React.ComponentProps<"div">, VariantProps<typeof iconVariants> {
  title?: string;
  text?: string;
  icon?: LucideIcon;
  actionText?: React.ReactNode;
  onActionButtonClick?: () => void;
}

export const iconVariants = cva(
  "size-9 flex items-center justify-center rounded-full p-2",
  {
    variants: {
      iconColor: {
        primary: "bg-primary/15 text-primary",
        primary2: "bg-primary2/15 text-primary2",
        success: "bg-success/15 text-success",
        warning: "bg-amber-500/15 text-amber-500",
        danger: "bg-destructive/15 text-destructive",
        info: "bg-info/15 text-info",
        purple: "bg-violet-500/15 text-violet-500",
        pink: "bg-pink-500/15 text-pink-500",
        orange: "bg-orange-500/15 text-orange-500",
        teal: "bg-teal-500/15 text-teal-500",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      iconColor: "primary",
    },
  },
);

const VerifiedBadge = ({ ok }: { ok: boolean }) => {
  return ok ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-500/10 text-success border border-emerald-500/20 whitespace-nowrap">
      <CheckCircle2 size={10} strokeWidth={2.5} /> Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-amber-500/9 text-info border border-amber-500/20 whitespace-nowrap">
      <AlertCircle size={10} strokeWidth={2.5} /> Not Verified
    </span>
  );
};

export const InputField = ({
  label,
  icon: Icon,
  iconClassName,
  isVerified,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <div className="flex flex-col">
      <label htmlFor="" className="text-foreground/60">
        {label}
      </label>

      <div className="border border-border rounded-xl flex flex-row items-center gap-x-2 overflow-hidden px-3">
        {Icon && (
          <Icon className={cn("size-5 text-foreground/40", iconClassName)} />
        )}

        <input
          type="text"
          className={cn(
            "w-full text-foreground/80 rounded-inherit outline-none py-2",
            className,
          )}
          {...props}
        />

        {isVerified !== undefined && <VerifiedBadge ok={isVerified} />}
      </div>
    </div>
  );
};

export const Container = ({
  title,
  text,
  icon: Icon,
  iconColor,
  actionText,
  onActionButtonClick,
  children,
  className,
  ...props
}: ContainerProps) => {
  return (
    <div
      {...props}
      className={cn("bg-accent/40 rounded-xl space-y-5 py-6", className)}
    >
      {title && (
        <div
          className={cn(
            "flex flex-row justify-between items-center gap-x-1 sm:gap-x-3 px-4 sm:px-6 pb-4 sm:pb-6",
            title && "border-b border-border",
          )}
        >
          <div className="flex flex-row items-center gap-x-3 sm:gap-x-4">
            {Icon && (
              <div className={iconVariants({ iconColor })}>
                {Icon && <Icon className="size-6 sm:size-8" />}
              </div>
            )}

            {title && (
              <div className="flex flex-col">
                <p className="text-sm sm:text-base font-medium text-foreground">
                  {title}
                </p>

                {text && (
                  <p className="text-[10px] sm:text-xs line-clamp-1 text-foreground/40">
                    {text}
                  </p>
                )}
              </div>
            )}
          </div>

          {actionText && (
            <button
              onClick={onActionButtonClick}
              className="flex-none text-xs sm:text-sm text-foreground/60 font-medium border border-border rounded-xl px-2 sm:px-3 py-1 hover:scale-105 hover:shadow hover:shadow-primary/40 hover:text-foreground transition-all duration-300"
            >
              {actionText}
            </button>
          )}
        </div>
      )}

      {children}
    </div>
  );
};
