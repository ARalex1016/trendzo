// Types
import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes } from "react";

interface InputFieldProps {
  label?: string;
  Icon?: LucideIcon;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
}

export const InputFieldWithLabelNIcon = ({
  label,
  Icon,
  className,
  labelClassName,
  inputClassName,
  iconClassName,
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

      <div className="bg-accent rounded-md flex flex-row items-center gap-x-1 sm:gap-x-2 border border-border focus-within:border-primary pl-2 sm:pl-3">
        {Icon && (
          <Icon
            size={"16px"}
            className={`text-foreground/70 ${iconClassName}`}
          />
        )}

        <input
          id={id}
          className={`w-full outline-none! rounded-inherit py-2 ${inputClassName}`}
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
  inputClassName,
  iconClassName,
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

      <div className="bg-accent rounded-md flex flex-row items-center gap-x-2 border border-border focus-within:border-primary">
        {Icon && (
          <Icon
            size={"16px"}
            className={`text-foreground/70 ${iconClassName}`}
          />
        )}

        <textarea
          id={id}
          rows={5}
          className={`flex-1 min-w-0 outline-none! resize-y rounded-inherit px-3 py-2 ${inputClassName}`}
          {...inputProps}
        />
      </div>
    </div>
  );
};

export const InputFieldWithLabelNIconOutsie = ({
  label,
  Icon,
  className,
  labelClassName,
  inputClassName,
  iconClassName,
  id,
  ...inputProps
}: InputFieldProps & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className={`flex flex-col gap-y-1 ${className}`}>
      <div className="flex flex-row items-center gap-x-2">
        {Icon && (
          <Icon
            size={"16px"}
            className={`text-foreground/70 ${iconClassName}`}
          />
        )}

        {label && (
          <label
            htmlFor={id}
            className={`text-sm text-foreground/70 ${labelClassName}`}
          >
            {label}
          </label>
        )}
      </div>

      <input
        id={id}
        className={`w-full outline-none! bg-accent rounded-md border border-border focus-within:border-primary transition-all duration-200 pl-3 py-2 ${inputClassName}`}
        {...inputProps}
      />
    </div>
  );
};
