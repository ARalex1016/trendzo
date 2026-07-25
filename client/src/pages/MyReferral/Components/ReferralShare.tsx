import { useRef } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";

// Lib
import { cn } from "@/lib/utils";

// Store
import useAuthStore from "@/store/useAuthStore";

// Icons
import { Copy } from "lucide-react";

const ReferralLink = ({ className }: React.ComponentProps<"div">) => {
  const { user } = useAuthStore();

  let referralId = user?.referralId;
  let origin = window.location.origin;

  const referralURL = user?.referralId ? `${origin}?ref=${referralId}` : "";

  if (!user || !user?.referralId) {
    return;
  }

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl space-y-3 p-3",
        className,
      )}
    >
      <p className="text-lg font-medium">Your Referral Link</p>

      <div className="flex flex-row gap-x-2">
        <input
          type="text"
          value={referralURL}
          readOnly
          className="w-full text-sm text-foreground/80 bg-background border border-border outline-none rounded-xl px-3 py-3"
        />

        <button className="font-medium bg-primary-gradient flex flex-row items-center gap-x-2 rounded-xl px-5 py-3">
          <Copy size={18} />

          <span>Copy</span>
        </button>
      </div>
    </div>
  );
};

const QRShare = ({ className }: React.ComponentProps<"div">) => {
  const { user } = useAuthStore();

  const qrRef = useRef<HTMLDivElement>(null);

  if (!user || !user?.referralId) {
    return;
  }

  const downloadQRCode = async () => {
    if (!qrRef.current) return;

    const dataUrl = await toPng(qrRef.current);

    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div
      className={cn(
        "w-full bg-card flex flex-col gap-y-3 border border-border rounded-xl p-3",
        className,
      )}
    >
      <p className="text-lg font-medium">QR Code</p>

      <div ref={qrRef}>
        <QRCode
          size={256}
          value={user?.referralId}
          style={{
            width: "100%",
            height: "auto",
            maxWidth: "256px",
          }}
        />
      </div>

      <div>
        <button
          onClick={downloadQRCode}
          className="text-lg font-medium bg-primary rounded-xl px-4 py-1"
        >
          Download
        </button>
      </div>
    </div>
  );
};

const ReferralShare = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {/* Link & Shares */}

      <ReferralLink className="col-span-1 sm:col-span-2" />

      {/* QR Codes */}
      <QRShare />
    </div>
  );
};

export default ReferralShare;
