// hooks/useFirstStepError.ts
import {
  useFormContext,
  type FieldErrors,
  type FieldValues,
} from "react-hook-form";

function findFirstErrorPath(
  errors: FieldErrors,
  parentPath = ""
): string | null {
  for (const key in errors) {
    const value = errors[key];
    const currentPath = parentPath ? `${parentPath}.${key}` : key;

    if (value && typeof value === "object" && "message" in value) {
      return currentPath;
    }

    if (value && typeof value === "object") {
      const childError = findFirstErrorPath(value as FieldErrors, currentPath);
      if (childError) return childError;
    }
  }

  return null;
}

export function useFirstStepError<T extends FieldValues>() {
  const {
    formState: { errors },
  } = useFormContext<T>();

  const firstErrorPath = findFirstErrorPath(errors);

  return { firstErrorPath };
}
