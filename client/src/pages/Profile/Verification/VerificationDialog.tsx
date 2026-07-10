import { useState, useEffect, useRef, forwardRef } from "react";
import toast from "react-hot-toast";

// Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Lib
import { cn } from "@/lib/utils";

// Store
import useAuthStore from "@/store/useAuthStore";

// Icons
import { Mail, Phone, CircleAlert, Clock, Loader } from "lucide-react";

// Type
import type { ApiResponse } from "@/types/response.type";

export type VeriFicationType = "email" | "phone";

interface VerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  veriFicationType: VeriFicationType;
  expireAt: number | null;
}

interface VerificationFormProps {
  expireAt: number | null;
  onSuccess: () => void;
}

const InputField = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="text"
        maxLength={1}
        placeholder="•"
        className="size-10 sm:size-12 text-center border border-foreground/40 rounded-xl outline-none focus:border-primary/60 focus:shadow-md focus:shadow-primary/20"
        {...props}
      />
    );
  },
);

const ResendCode = ({
  timer,
  handleResend,
}: {
  timer: number | null;
  handleResend: () => Promise<ApiResponse<any>>;
}) => {
  const [expiresAt, setExpiresAt] = useState(timer ?? Date.now() + 60_000);

  const [isResending, setIsResending] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)),
  );

  type CountdownPhase = "normal" | "warning" | "critical";

  const [countdownPhase, setCountdownPhase] =
    useState<CountdownPhase>("normal");

  const getCountdownPhase = (seconds: number): CountdownPhase => {
    if (seconds <= 15) return "critical";
    if (seconds <= 30) return "warning";
    return "normal";
  };

  const handleResendClick = async () => {
    setIsResending(true);
    try {
      let res = await handleResend();

      if (res.data.expiresAt) {
        setExpiresAt(res.data.expiresAt);
      }
    } catch (error) {
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    const update = () => {
      const seconds = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));

      setTimeLeft(seconds);
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  useEffect(() => {
    const phase = getCountdownPhase(timeLeft);

    setCountdownPhase(phase);
  }, [timeLeft]);

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  // If Timer finishes
  if (timeLeft <= 0) {
    return (
      <button
        disabled={isResending}
        onClick={handleResendClick}
        className="bg-success/5 rounded-inherit border border-success flex flex-row items-center gap-x-1 px-4 py-1 m-auto enabled:cursor-pointer disabled:cursor-not-allowed"
      >
        <Clock size={14} className="text-success" />

        <p className="text-success text-sm font-medium">Ready to resend</p>
      </button>
    );
  }

  // If Timer is runnung
  return (
    <div
      className={cn(
        "bg-accent rounded-inherit border shadow flex flex-row items-center gap-x-1 px-3 py-1 m-auto",
        countdownPhase === "normal" && "border-border shadow-accent/30",
        countdownPhase === "warning" && "border-info/60 shadow-info/30",
        countdownPhase === "critical" && "border-destructive/60 shadow-info/30",
      )}
    >
      <Clock
        size={12}
        className={cn(
          "animate-spin [animation-duration:5s]",
          countdownPhase === "normal" && "text-muted-foreground",
          countdownPhase === "warning" && "text-info",
          countdownPhase === "critical" && "text-destructive",
        )}
      />

      <p className={cn("text-xs text-muted-foreground")}>Resend available in</p>

      <span
        className={cn(
          "text-sm font-medium",
          countdownPhase === "normal" && "text-foreground/80",
          countdownPhase === "warning" && "text-info",
          countdownPhase === "critical" && "text-destructive",
        )}
      >
        {formattedTime}
      </span>
    </div>
  );
};

const EmailVerificationForm = ({
  expireAt,
  onSuccess,
}: VerificationFormProps) => {
  const { user, verifyEmail, sendEmailOtp } = useAuthStore();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const OTP_LENGTH = 6;

  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const isComplete = code.every((digit) => digit !== "");

  const handleChange = (index: number, value: string) => {
    // Allow only numbers
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const newCode = [...code];

    pasted.split("").forEach((digit, i) => {
      newCode[i] = digit;
    });

    setCode(newCode);

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyClick = async () => {
    const otpString = code.join("");

    if (!/^\d{6}$/.test(otpString)) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }

    const otp = Number(otpString);

    setIsVerifying(true);

    try {
      await verifyEmail(otp);

      onSuccess(); // <-- closes the dialog
    } catch (error) {
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <DialogContent className="max-w-[calc(100%-calc(var(--spacing-side-spacing)*2))] sm:max-w-md shadow shadow-primary/40 sm:px-10">
      <DialogHeader className="flex flex-col items-center">
        <div className="size-14 sm:size-16 bg-primary/15 rounded-full border border-primary/40 flex flex-row justify-center items-center animate-pulse">
          <Mail size={20} className="text-primary" />
        </div>

        <DialogTitle className="text-base sm:text-lg">
          Verify your email
        </DialogTitle>

        <DialogDescription className="text-xs sm:text-sm text-wrap">
          We've sent a 6-digit verification code to your email address.
        </DialogDescription>

        <div className="bg-primary/5 border border-primary/30 rounded-2xl flex flex-row items-center gap-x-2 px-4 py-1 hover:scale-105 transition-all duration-300">
          <Mail size={12} className="text-primary" />
          <p className="text-primary text-xs">{user?.email}</p>
        </div>
      </DialogHeader>

      <div>
        <p className="text-base text-foreground/80 font-medium">
          Verification Code
        </p>

        {/* Input Fields */}
        <div className="w-full flex flex-row justify-between gap-x-1 sm:gap-x-2 py-2">
          {code.map((digit, index) => (
            <InputField
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          Enter the 6-digit code we sent to your email.
        </p>
      </div>

      <ResendCode timer={expireAt} handleResend={sendEmailOtp} />

      {/* Verify Button */}
      <button
        disabled={!isComplete || isVerifying}
        onClick={handleVerifyClick}
        className="bg-primary font-medium rounded-inherit flex flex-row justify-center items-center gap-x-2 py-2 hover:scale-105 transition-all duration-300 enabled:cursor-pointer disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:scale-100"
      >
        <span>Verify Email</span>

        <Loader
          size={20}
          className={cn("animate-spin", isVerifying ? "block" : "hidden")}
        />
      </button>

      <Separator />

      {/* Alert Info */}
      <div className="bg-accent rounded-inherit border border-border/60 flex flex-row gap-x-2 px-3 py-2">
        <CircleAlert className="text-muted-foreground" />

        <p className="text-xs text-muted-foreground">
          Didn't receive the email? Check your spam folder or try sending
          another verification email.
        </p>
      </div>
    </DialogContent>
  );
};

const PhoneVerificationForm = ({
  expireAt,
  onSuccess,
}: VerificationFormProps) => {
  const { user, verifyEmail } = useAuthStore();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const OTP_LENGTH = 6;

  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const isComplete = code.every((digit) => digit !== "");

  const handleChange = (index: number, value: string) => {
    // Allow only numbers
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const newCode = [...code];

    pasted.split("").forEach((digit, i) => {
      newCode[i] = digit;
    });

    setCode(newCode);

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyClick = async () => {
    const otpString = code.join("");

    if (!/^\d{6}$/.test(otpString)) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }

    const otp = Number(otpString);

    setIsVerifying(true);

    try {
      await verifyEmail(otp);

      onSuccess(); // <-- closes the dialog
    } catch (error) {
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <DialogContent className="max-w-[calc(100%-calc(var(--spacing-side-spacing)*2))] sm:max-w-md shadow shadow-primary/40 sm:px-10">
      <DialogHeader className="flex flex-col items-center">
        <div className="size-14 sm:size-16 bg-primary/15 rounded-full border border-primary/40 flex flex-row justify-center items-center animate-pulse">
          <Phone size={20} className="text-primary" />
        </div>

        <DialogTitle className="text-base sm:text-lg">
          Verify your phone number
        </DialogTitle>

        <DialogDescription className="text-xs sm:text-sm text-wrap">
          We've sent a 6-digit verification code to your phone number.
        </DialogDescription>

        <div className="bg-primary/5 border border-primary/30 rounded-2xl flex flex-row items-center gap-x-2 px-4 py-1 hover:scale-105 transition-all duration-300">
          <Phone size={12} className="text-primary" />
          <p className="text-primary text-xs">{user?.phone}</p>
        </div>
      </DialogHeader>

      <div>
        <p className="text-base text-foreground/80 font-medium">
          Verification Code
        </p>

        {/* Input Fields */}
        <div className="w-full flex flex-row justify-between gap-x-1 sm:gap-x-2 py-2">
          {code.map((digit, index) => (
            <InputField
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          Enter the 6-digit code we sent to your phone number.
        </p>
      </div>

      {/* <ResendCode timer={expireAt} handleResend={}/> */}

      {/* Verify Button */}
      <button
        disabled={!isComplete || isVerifying}
        onClick={handleVerifyClick}
        className="bg-primary font-medium rounded-inherit py-2 hover:scale-105 transition-all duration-300 enabled:cursor-pointer disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:scale-100"
      >
        Verify Phone
      </button>

      <Separator />

      {/* Alert Info */}
      {/* <div className="bg-accent rounded-inherit border border-border/60 flex flex-row gap-x-2 px-3 py-2">
        <CircleAlert className="text-muted-foreground" />

        <p className="text-xs text-muted-foreground">
          Didn't receive the message? Check your spam folder or try sending
          another verification email.
        </p>
      </div> */}
    </DialogContent>
  );
};

const VerificationDialog = ({
  open,
  onOpenChange,
  expireAt,
  veriFicationType,
}: VerificationDialogProps) => {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {veriFicationType === "email" ? (
        <EmailVerificationForm expireAt={expireAt} onSuccess={handleSuccess} />
      ) : (
        <PhoneVerificationForm expireAt={expireAt} onSuccess={handleSuccess} />
      )}
    </Dialog>
  );
};

export default VerificationDialog;
