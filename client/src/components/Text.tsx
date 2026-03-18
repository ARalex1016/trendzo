import type React from "react";

interface BaseTextProps {
  className?: string;
}

interface TitleProps extends BaseTextProps {
  text: string;
}

interface BaseTextComponentProps extends BaseTextProps {
  children: React.ReactNode; // ✅ required
}

export const Title = ({ text, className }: TitleProps) => {
  return <h2 className={`text-xl font-semibold ${className}`}>{text}</h2>;
};

export const BaseText = ({ children, className }: BaseTextComponentProps) => {
  return <p className={`text-foreground/60 ${className}`}>{children}</p>;
};
