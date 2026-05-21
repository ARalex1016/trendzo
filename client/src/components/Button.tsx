import { useNavigate } from "react-router-dom";

// Components
import { Button } from "./ui/button";

// Icons
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to: string;
  label?: string;
  className?: string;
}

export const BackButton = ({
  to,
  label = "Back",
  className = "",
}: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      variant={"secondary"}
      onClick={() => navigate(to)}
      className={[
        "justify-self-start text-xs text-foreground/60 hover:text-foreground gap-x-1 pl-0!",
        className,
      ].join(" ")}
    >
      <ArrowLeft />

      <span>{label}</span>
    </Button>
  );
};
