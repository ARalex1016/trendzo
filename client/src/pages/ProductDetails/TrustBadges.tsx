// Icons
import { type LucideIcon, Truck, ShieldCheck, RotateCcw } from "lucide-react";

interface IconContainerProps {
  icon: LucideIcon;
  name: string;
  description: string;
}

const trustBadges = [
  {
    id: 1,
    icon: Truck,
    name: "Free Delivery",
    description: "Orders over Rs. 2,000",
  },
  {
    id: 2,
    icon: ShieldCheck,
    name: "Genuine Product",
    description: "100% Authentic",
  },
  {
    id: 3,
    icon: RotateCcw,
    name: "Easy Returns",
    description: "7-Day Policy",
  },
];

const IconContainer = ({
  icon: Icon,
  name,
  description,
}: IconContainerProps) => {
  return (
    <div className="flex flex-col items-center gap-y-1">
      <Icon className="text-primary" />

      <p className="text-sm text-foreground">{name}</p>

      <p className="text-xs text-foreground/60">{description}</p>
    </div>
  );
};

const TrustBadges = () => {
  return (
    <div className="w-full flex flex-row justify-around">
      {trustBadges.map((badge) => {
        return (
          <IconContainer
            key={badge.id}
            icon={badge.icon}
            name={badge.name}
            description={badge.description}
          />
        );
      })}
    </div>
  );
};

export default TrustBadges;
