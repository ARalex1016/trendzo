import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import toast from "react-hot-toast";

// Components
import ShareButton from "@/components/ShareComponents/ShareButton";
import SharePlatform from "@/components/ShareComponents/SharePlatform";

// Lib
import { cn } from "@/lib/utils";

// Store
import useAuthStore from "@/store/useAuthStore";

// Utils
import { copyText } from "@/utils/StringManager";

// Icons
import { Copy, Check, Download } from "lucide-react";

const Container = ({ children, className }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl space-y-3 p-4 sm:p-5 lg:p-7",
        className,
      )}
    >
      {children}
    </div>
  );
};

const ReferralLink = ({ className }: React.ComponentProps<"div">) => {
  const { user } = useAuthStore();

  const [isCopied, setIsCopied] = useState(false);

  let referralId = user?.referralId;
  let origin = window.location.origin;

  const referralURL = user?.referralId ? `${origin}?ref=${referralId}` : "";

  const handleCopy = async () => {
    if (!referralURL) {
      toast.error("Referral link is not available");
      return;
    }

    const success = await copyText(referralURL);

    if (success) {
      setIsCopied(true);
      toast.success("Referral link copied to clipboard");

      // Reset after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      toast.error("Failed to copy referral link. Please try again.");
    }
  };

  if (!user || !user?.referralId) {
    return;
  }

  return (
    <Container className={className}>
      <p className="text-lg font-medium">Your Referral Link</p>

      <div className="flex flex-row gap-x-2">
        <input
          type="text"
          value={referralURL}
          readOnly
          className="w-full text-xs sm:text-sm text-foreground/80 bg-background border border-border outline-none rounded-xl px-3 py-2 sm:py-3"
        />

        <button
          onClick={handleCopy}
          className="text-sm sm:text-base font-medium bg-primary-gradient flex flex-row items-center gap-x-2 rounded-xl px-4 sm:px-5 py-2 sm:py-3"
        >
          {isCopied ? <Check /> : <Copy />}

          <span>Copy</span>
        </button>
      </div>

      <div className="flex flex-row flex-wrap gap-2">
        <SharePlatform platform="whatsapp" />
        <SharePlatform platform="facebook" />
        <SharePlatform platform="telegram" />

        <ShareButton link={referralURL} />
      </div>
    </Container>
  );
};

const QRShare = ({ className }: React.ComponentProps<"div">) => {
  const { user } = useAuthStore();

  const qrRef = useRef<HTMLDivElement>(null);

  if (!user || !user?.referralId) {
    return;
  }

  const downloadQRCode = async () => {
    try {
      if (!qrRef.current) {
        toast.error("QR code is not available");
        return;
      }

      const dataUrl = await toPng(qrRef.current);

      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = dataUrl;
      link.click();

      toast.success("QR code downloaded successfully");
    } catch (error) {
      toast.error("Failed to download QR code. Please try again.");
    }
  };

  return (
    <Container className={className}>
      <p className="text-lg font-medium">QR Code</p>

      <div ref={qrRef}>
        <QRCode
          value={user?.referralId}
          className="size-24 mx-auto"
          style={{
            width: "100%",
            height: "auto",
            maxWidth: "180px",
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-x-2 sm:gap-x-3">
        <button
          onClick={downloadQRCode}
          className="text-base font-medium bg-primary flex flex-row gap-x-2 justify-center items-center rounded-xl px-4 py-1 hover:scale-105 transition-all duration-200"
        >
          <Download className="size-4 sm:size-5" />

          <span>Download</span>
        </button>

        <ShareButton className="text-base justify-center" />
      </div>
    </Container>
  );
};

const ReferralShare = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
      {/* Link & Shares */}

      <ReferralLink className="col-span-1 sm:col-span-2" />

      {/* QR Codes */}
      <QRShare />
    </div>
  );
};

export default ReferralShare;
