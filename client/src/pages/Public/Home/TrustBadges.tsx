import type { ReactNode } from "react";

// Icons
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

interface CommonComponentProps {
  className?: string;
  children?: ReactNode;
}

const Card = ({ className, children }: CommonComponentProps) => {
  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 md:justify-start ${className}`}
    >
      {children}
    </div>
  );
};

const IconContainer = ({ className, children }: CommonComponentProps) => {
  return (
    <div
      className={`size-8 sm:size-10 rounded-lg bg-accent flex items-center justify-center shrink-0 ${className}`}
    >
      {children}
    </div>
  );
};

const Column = ({ className, children }: CommonComponentProps) => {
  return <div className={`flex flex-col ${className}`}>{children}</div>;
};

const Title = ({ className, children }: CommonComponentProps) => {
  return <p className={`text-sm font-medium ${className}`}>{children}</p>;
};

const Detail = ({ className, children }: CommonComponentProps) => {
  return (
    <p className={`text-xs text-card-foreground/60 ${className}`}>{children}</p>
  );
};

const TrustBadges = () => {
  return (
    <section className="bg-card grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4 sm:gap-4 px-side-spacing py-8 border-y border-border">
      {/* Delivery Info */}
      <Card>
        <IconContainer>
          <Truck className="size-4 sm:size-5 text-accent-foreground" />
        </IconContainer>

        <Column>
          <Title>Free Delivery</Title>
          <Detail>On orders over Rs. 2,000</Detail>
        </Column>
      </Card>

      {/* Paymeny Info */}
      <Card>
        <IconContainer>
          <ShieldCheck className="size-4 sm:size-5 text-accent-foreground" />
        </IconContainer>

        <Column>
          <Title>Secure Payment</Title>
          <Detail>100% secure checkout</Detail>
        </Column>
      </Card>

      {/* Return Policy Info */}
      <Card>
        <IconContainer>
          <RotateCcw className="size-4 sm:size-5 text-accent-foreground" />
        </IconContainer>

        <Column>
          <Title>Easy Returns</Title>
          <Detail>7-day return policy</Detail>
        </Column>
      </Card>

      {/* Support Info */}
      <Card>
        <IconContainer>
          <Headphones className="size-4 sm:size-5 text-accent-foreground" />
        </IconContainer>

        <Column>
          <Title>24/7 Support</Title>
          <Detail>Dedicated assistance</Detail>
        </Column>
      </Card>
    </section>
  );
};

export default TrustBadges;
