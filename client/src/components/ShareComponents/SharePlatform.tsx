// Store
import useAuthStore from "@/store/useAuthStore";

// Utils
import { capitalize } from "@/utils/StringManager";

// Icons
import { Facebook, Send } from "lucide-react";
import { FaWhatsapp, FaFacebookMessenger, FaTiktok } from "react-icons/fa";

type Platform = "whatsapp" | "facebook" | "messenger" | "telegram" | "tiktok";

interface SharePlatformProps {
  label?: string;
  link?: URL | string;
  platform: Platform;
}

const iconMap = {
  whatsapp: {
    label: "WhatsApp",
    icon: <FaWhatsapp className="size-3.5 sm:size-4" />,
    color: "#25D366", // WhatsApp brand green
  },
  facebook: {
    label: "Facebook",
    icon: <Facebook className="size-3.5 sm:size-4" />,
    color: "#1877F2", // Facebook brand blue
  },
  messenger: {
    label: "Messenger",
    icon: <FaFacebookMessenger className="size-3.5 sm:size-4" />,
    color: "#0084FF", // Messenger brand blue
  },
  telegram: {
    label: "Telegram",
    icon: <Send className="size-3.5 sm:size-4" />,
    color: "#26A5E4", // Telegram brand blue
  },
  tiktok: {
    label: "TikTok",
    icon: <FaTiktok className="size-3.5 sm:size-4" />,
    color: "#000000", // TikTok black
  },
} as const;

const SharePlatform = ({ link, platform }: SharePlatformProps) => {
  const { user } = useAuthStore();

  const config = iconMap[platform];

  const handleShare = async () => {
    const url = new URL(link || window.location.href);

    if (user?.referralId) {
      url.searchParams.set("ref", user.referralId);
    }

    const encodedUrl = encodeURIComponent(url.toString());
    const text = encodeURIComponent("Check this product");

    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${encodedUrl}`;
        break;

      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;

      case "messenger":
        // Messenger no longer supports a public web share URL.
        // Fall back to Facebook's share dialog.
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;

      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${text}`;
        break;

      case "tiktok":
        // TikTok doesn't support direct URL sharing.
        await navigator.clipboard.writeText(url.toString());

        if (navigator.share) {
          await navigator.share({
            title: "",
            text: "Check this product",
            url: url.toString(),
          });
        } else {
          alert("Link copied! Paste it into TikTok.");
        }
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleShare}
      className="text-xs sm:text-sm font-medium bg-accent/80 border border-border/80 rounded-xl flex flex-row items-center gap-x-2 px-3 py-1.5 sm:py-2 hover:bg-accent hover:border-border transition-all duration-200 hover:scale-105 cursor-pointer"
      style={
        {
          "--brand-color": config.color,
          //   color: "var(--brand-color)",
          color: `${config.color}`,
          borderColor: `${config.color}`,
          backgroundColor: `${config.color}20`,
        } as React.CSSProperties
      }
    >
      <span className="transition-colors duration-200 group-hover:text-white">
        {config.icon}
      </span>

      <span className="transition-colors duration-200 group-hover:text-white">
        {capitalize(config.label)}
      </span>
    </button>
  );
};

export default SharePlatform;
