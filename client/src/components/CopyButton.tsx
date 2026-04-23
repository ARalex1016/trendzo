import { useState } from "react";

// Icons
import { Copy, Check } from "lucide-react";

// Utils
import { copyText } from "@/utils/StringManager";

export const CopyButton = ({ value }: { value?: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;

    const success = await copyText(value);

    if (success) {
      setIsCopied(true);

      // Reset after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div onClick={handleCopy} className="cursor-pointer">
      {isCopied ? <Check size={20} /> : <Copy size={20} className="" />}
    </div>
  );
};
