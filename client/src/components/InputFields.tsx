// Types
import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  Icon: LucideIcon;
  className?: string;
}

export const InputFieldWithLabelNIcon = ({
  label,
  Icon,
  className,
  id,
  ...inputProps
}: InputFieldProps) => {
  return (
    <div className={`flex flex-col gap-y-1 ${className}`}>
      <label htmlFor={id} className="text-sm text-foreground/70">
        {label}
      </label>

      <div className="bg-accent rounded-md flex flex-row items-center gap-x-2 border border-border focus-within:border-primary pl-3">
        <Icon size={"16px"} className="text-foreground/70" />

        <input
          id={id}
          className="w-full outline-none! rounded-inherit py-2"
          {...inputProps}
        />
      </div>
    </div>
  );
};
