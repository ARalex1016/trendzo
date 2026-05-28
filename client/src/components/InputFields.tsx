// Types
import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes } from "react";

interface InputFieldProps {
  label?: string;
  Icon?: LucideIcon;
  className?: string;
  labelClassName?: string;
}

export const InputFieldWithLabelNIcon = ({
  label,
  Icon,
  className,
  labelClassName,
  id,
  ...inputProps
}: InputFieldProps & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className={`flex flex-col gap-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm text-foreground/70 ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <div className="bg-accent rounded-md flex flex-row items-center gap-x-2 border border-border focus-within:border-primary pl-3">
        {Icon && <Icon size={"16px"} className="text-foreground/70" />}

        <input
          id={id}
          className="w-full outline-none! rounded-inherit py-2"
          {...inputProps}
        />
      </div>
    </div>
  );
};

export const TextAreaiWithLabelNIcon = ({
  label,
  Icon,
  className,
  labelClassName,
  id,
  ...inputProps
}: InputFieldProps & InputHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <div className={`flex flex-col gap-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm text-foreground/70 ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <div className="bg-accent rounded-md flex flex-row items-center gap-x-2 border border-border focus-within:border-primary pl-3">
        {Icon && <Icon size={"16px"} className="text-foreground/70" />}

        <textarea
          id={id}
          rows={5}
          className="w-full outline-none! rounded-inherit py-2"
          {...inputProps}
        />
      </div>
    </div>
  );
};
