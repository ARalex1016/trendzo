import type React from "react";

// Types
import { type LucideIcon } from "lucide-react";

interface BaseTextProps {
  className?: string;
}

interface TitleProps extends BaseTextProps {
  text: string;
}

interface BaseTextComponentProps extends BaseTextProps {
  children: React.ReactNode; // ✅ required
}

interface TextWithIconProps {
  text: string;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export const Title = ({ text, className }: TitleProps) => {
  return <h2 className={`text-xl font-semibold ${className}`}>{text}</h2>;
};

export const BaseText = ({ children, className }: BaseTextComponentProps) => {
  return <p className={`text-foreground/60 ${className}`}>{children}</p>;
};

export const TextWithIcon = ({
  text,
  icon: Icon,
  className = "",
  iconClassName = "",
  textClassName = "",
}: TextWithIconProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Icon
        className={`size-4 shrink-0 ${iconClassName}`}
        strokeWidth={2}
        aria-hidden="true"
      />

      <span className={`${textClassName}`}>{text}</span>
    </div>
  );
};
