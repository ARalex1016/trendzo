import type { ReactNode } from "react";

// Components
import { Title, BaseText } from "./Text";
import { BackButton } from "./Button";

interface TitleTextContainerProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

interface PageShellProps {
  back?: string;
  to?: string;
  children?: ReactNode;
  className?: string;
}

export const TitleTextContainer = ({
  title,
  children,
  className,
}: TitleTextContainerProps) => {
  return (
    <div className={`flex flex-col gap-y-1 ${className}`}>
      <Title text={title} />

      {children && <BaseText>{children}</BaseText>}
    </div>
  );
};

export const PageShell = ({
  back,
  to,
  children,
  className,
}: PageShellProps) => {
  return (
    <section className="w-full px-side-spacing py-4">
      {to && back && <BackButton to={to} label={back} />}

      <div className={`w-full ${className}`}>{children}</div>
    </section>
  );
};
