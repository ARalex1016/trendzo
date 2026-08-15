import { useState } from "react";

// Components
import VerificationDialog, {
  type VeriFicationType,
} from "./VerificationDialog";

// Lib
import { cn } from "@/lib/utils";

// Icons
import { AlertCircle, Loader } from "lucide-react";

// Types
import type { ApiResponse } from "@/types/response.type";

interface VerificationBannerProps {
  text: string;
  buttonText: string;
  onClick?: () => Promise<ApiResponse<any>>;
  veriFicationType: VeriFicationType;
}

export const VerificationBanner = ({
  text,
  buttonText,
  onClick,
  veriFicationType,
}: VerificationBannerProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [expireAt, setExpireAt] = useState<number | null>(null);

  const handleVerificationClick = async () => {
    if (!onClick) return;

    setLoading(true);

    try {
      let res = await onClick();

      // Open dialog only after success
      setOpen(true);

      if (res.data.expiresAt) {
        setExpireAt(res.data.expiresAt);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-accent/60 rounded-xl border border-border flex flex-row justify-between px-3 py-2">
      <div className="flex flex-row items-center gap-x-2">
        <AlertCircle className="size-5 text-foreground/60" />

        <p className="text-foreground/60">{text}</p>
      </div>

      <button
        disabled={loading}
        onClick={handleVerificationClick}
        className="text-xs sm:text-sm text-foreground font-medium bg-accent border border-border rounded-xl flex flex-row gap-x-1 px-4 py-2 enabled:hover:scale-105 enabled:hover:shadow-sm enabled:hover:shadow-primary/40 enabled:cursor-pointer disabled:cursor-not-allowed disabled:text-foreground/70 transition-all duration-300"
      >
        <span>{buttonText}</span>

        <Loader
          size={20}
          className={cn("animate-spin", loading ? "block" : "hidden")}
        />
      </button>

      <VerificationDialog
        open={open}
        onOpenChange={setOpen}
        veriFicationType={veriFicationType}
        expireAt={expireAt}
      />
    </div>
  );
};
