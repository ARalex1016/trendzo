import { cva } from "class-variance-authority";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SwitchCardProps {
  title: string;
  text: string;
  isActive: boolean;
  onChange: (value: boolean) => void;
  variant?: "default" | "success" | "warning";
  activeStateName?: string;
  activeStateIcon?: LucideIcon;
  icon: LucideIcon;
}

/**
 * Card container (border + base styling)
 */
const switchCardVariants = cva(
  "bg-background/40 border rounded-xl flex flex-col gap-y-2 p-5 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border",
        warning: "border-info/20 hover:shadow hover:shadow-info/20",
        success: "border-success/20 hover:shadow hover:shadow-success/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * FULL DESIGN TOKENS PER VARIANT (industry standard approach)
 */
const switchTheme = {
  default: {
    switch:
      "data-[state=checked]:bg-foreground data-[state=checked]:border-foreground",
    icon: "text-foreground",
    iconBg: "bg-foreground/10 border-border",
    badge: "bg-foreground/10 text-foreground border-border",
  },

  success: {
    switch:
      "data-[state=checked]:bg-success data-[state=checked]:border-success",
    icon: "text-success",
    iconBg: "bg-success/15 border-success/30",
    badge: "bg-success/15 text-success border-success/30",
  },

  warning: {
    switch: "data-[state=checked]:bg-info data-[state=checked]:border-info",
    icon: "text-info",
    iconBg: "bg-info/15 border-info/30",
    badge: "bg-info/15 text-info border-info/30",
  },
} as const;

const SwitchCard = ({
  title,
  text,
  isActive,
  onChange,
  variant = "default",
  activeStateName = "Active",
  activeStateIcon: StateIcon,
  icon: Icon,
}: SwitchCardProps) => {
  const theme = switchTheme[variant];

  return (
    <label
      className={cn("hover:scale-[1.02]", switchCardVariants({ variant }))}
    >
      {/* HEADER */}
      <div className="flex flex-row justify-between gap-x-3">
        <div className="flex flex-row gap-x-3">
          {/* Icons */}
          <div
            className={cn(
              "size-fit border rounded-xl p-2 transition-all duration-200",
              theme.iconBg,
            )}
          >
            <Icon
              className={cn(
                "size-4 lg:size-5 transition-all duration-200",
                theme.icon,
              )}
            />
          </div>

          {/* Title & Text */}
          <div>
            <p className="text-sm text-foreground font-medium line-clamp-1">
              {title}
            </p>

            <p className="text-xs text-foreground/40 font-medium line-clamp-1">
              {text}
            </p>
          </div>
        </div>

        <Switch
          checked={isActive}
          onCheckedChange={onChange}
          className={cn(theme.switch)}
        />
      </div>

      {/* Separator */}
      <Separator className={cn("my-1.5", isActive ? "visible" : "invisible")} />

      {/* Badge */}
      <div
        className={cn(
          "w-fit border rounded-xl flex flex-row items-center gap-x-2 px-2 py-0.5",
          theme.badge,
          isActive ? "visible" : "invisible",
        )}
      >
        {StateIcon && <StateIcon className="size-3.5" />}

        <p className="font-medium text-xs">{activeStateName}</p>
      </div>
    </label>
  );
};

export default SwitchCard;
