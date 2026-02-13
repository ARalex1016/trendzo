import { useState, useEffect } from "react";
import PasswordInput from "./password";

type StrongPasswordInputProps = {
  value: string;
  onChange: (value: string) => void;
};

// SVG Icon for validation check (valid)
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// SVG Icon for validation cross (invalid)
const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Validation criteria configuration
// const validationRules = [
//   { id: "length", text: "At least 8 characters", regex: /.{8,}/ },
//   { id: "number", text: "At least 1 number", regex: /\d/ },
//   { id: "lowercase", text: "At least 1 lowercase letter", regex: /[a-z]/ },
//   { id: "uppercase", text: "At least 1 uppercase letter", regex: /[A-Z]/ },
//   {
//     id: "special",
//     text: "At least 1 special character",
//     regex: /[^A-Za-z0-9]/,
//   },
// ];

// A single validation  item component
const ValidationItem = ({
  isValid,
  text,
}: {
  isValid: boolean;
  text: string;
}) => (
  <li
    className={`flex items-center transition-colors duration-300 text-xs text-red-600 ${
      isValid ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
    }`}
  >
    {isValid ? (
      <CheckIcon className="h-4 w-4 mr-2" />
    ) : (
      <XIcon className="h-4 w-4 mr-2" />
    )}
    <span>{text}</span>
  </li>
);

// The main Password Input Component with Validation

const StrongPasswordInput = ({ value, onChange }: StrongPasswordInputProps) => {
  //   const [showPassword, setShowPassword] = useState(false);
  const [isPristine, setIsPristine] = useState(true);

  const rules = {
    length: /.{8,}/.test(value),
    number: /\d/.test(value),
    lowercase: /[a-z]/.test(value),
    uppercase: /[A-Z]/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
  };

  useEffect(() => {
    setIsPristine(value === "");
  }, [value]);

  return (
    <div className="space-y-2">
      <PasswordInput
        value={value}
        onChange={onChange}
        placeholder="Create a strong password"
      />

      {!isPristine && (
        <ul className="space-y-1">
          <ValidationItem isValid={rules.length} text="At least 8 characters" />
          <ValidationItem isValid={rules.number} text="At least 1 number" />
          <ValidationItem
            isValid={rules.lowercase}
            text="At least 1 lowercase letter"
          />
          <ValidationItem
            isValid={rules.uppercase}
            text="At least 1 uppercase letter"
          />
          <ValidationItem
            isValid={rules.special}
            text="At least 1 special character"
          />
        </ul>
      )}
    </div>
  );
};

export default StrongPasswordInput;
