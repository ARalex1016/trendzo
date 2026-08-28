import type { ReactNode } from "react";

// Lib
import { cn } from "@/lib/utils";

// Components
import { Title, BaseText } from "./Text";
import { BackButton } from "./Button";

interface TitleTextContainerProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

interface PageShellProps {
  back?: string; // Back to Cart Page
  to?: string; // URL
  children?: ReactNode;
  className?: string;
}

export const TitleTextContainer = ({
  title,
  children,
  className,
}: TitleTextContainerProps) => {
  return (
    <div className={cn("flex flex-col gap-y-1", className)}>
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
    <section className="w-full flex flex-col items-start gap-y-2 px-side-spacing py-4">
      {to && back && <BackButton to={to} label={back} />}

      <div className={cn("w-full space-y-6 sm:space-y-7", className)}>
        {children}
      </div>
    </section>
  );
};

export const SkeletonBackButton = () => {
  return (
    <div className="mb-5 flex items-center gap-2">
      <div className="h-4 w-4 rounded bg-white/[0.08]" />
      <div className="h-4 w-20 rounded bg-white/[0.08]" />
    </div>
  );
};
