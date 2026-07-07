import { useState } from "react";

// Icons
import { Copy, Check } from "lucide-react";

// Lib
import { cva, type VariantProps } from "class-variance-authority";

// Utils
import { copyText } from "@/utils/StringManager";

const iconVariants = cva("", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type CopyButtonProps = {
  value?: string;
} & VariantProps<typeof iconVariants>;

export const CopyButton = ({ value, size }: CopyButtonProps) => {
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
      {isCopied ? (
        <Check className={iconVariants({ size })} />
      ) : (
        <Copy className={iconVariants({ size })} />
      )}
    </div>
  );
};
