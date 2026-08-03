// Lib
import { cn } from "@/lib/utils";

// Store
import useAuthStore from "@/store/useAuthStore";

// Icons
import { Share2 } from "lucide-react";

interface ShareButtonProps extends React.ComponentProps<"button"> {
  label?: string;
  link?: URL | string;
}

const ShareButton = ({
  label = "Share",
  link,
  className,
}: ShareButtonProps) => {
  const { user } = useAuthStore();

  const handleShare = async () => {
    try {
      const url = new URL(link || window.location.href);

      if (user?.referralId) {
        url.searchParams.set("ref", user.referralId);
      }

      await navigator.share({
        title: "",
        text: "Check this product",
        url: url.toString(),
      });
    } catch (error) {
      console.error("Sharing failed", error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={cn(
        "text-xs sm:text-sm font-medium bg-accent/80 border border-border/80 rounded-xl flex flex-row items-center gap-x-2 px-3 py-1.5 sm:py-2 hover:bg-accent hover:border-border transition-all duration-200 hover:scale-105 group cursor-pointer",
        className,
      )}
    >
      <span className="group-hover:scale-125 transition-all duration-200">
        <Share2 className="size-3.5 sm:size-4" />
      </span>

      <span>{label}</span>
    </button>
  );
};

export default ShareButton;
