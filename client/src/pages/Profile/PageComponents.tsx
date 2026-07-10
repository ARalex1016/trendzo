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

interface ContainerProps extends React.ComponentProps<"div"> {
  title?: string;
  text?: string;
  icon?: LucideIcon;
}

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
  children,
  className,
  ...props
}: ContainerProps) => {
  return (
    <div
      {...props}
      className={cn("bg-accent/40 rounded-xl space-y-5 py-6", className)}
    >
      <div className="flex flex-row items-center border-b border-border gap-x-4 px-6 pb-6">
        <div className="size-9 text-primary bg-primary/20 flex flex-row justify-center items-center p-2 rounded-full">
          {Icon && <Icon />}
        </div>

        {title && (
          <div className="flex flex-col">
            <p className="text-base font-medium text-foreground">{title}</p>

            {text && <p className="text-sm text-foreground/40">{text}</p>}
          </div>
        )}
      </div>

      {children}
    </div>
  );
};
