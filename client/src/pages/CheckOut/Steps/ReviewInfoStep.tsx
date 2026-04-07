import { useFormContext } from "react-hook-form";

// Types
import { type CheckoutSchemaType } from "@/validations/checkout.validator";

const ReviewInfoStep = () => {
  const form = useFormContext<CheckoutSchemaType>();

  const details = form.formState.defaultValues;

  return (
    <div className="flex flex-col gap-y-4 py-4">
      <div className="bg-accent border border-border rounded-xl flex flex-col gap-y-2 px-4 py-4">
        <p className="text-lg font-medium">Delivery Details</p>

        <p className="text-sm text-foreground/70">
          Durbar Marg, Ward 3, Kathmandu - 44600 --- NEED UPDATE ---
        </p>
      </div>

      <div className="bg-accent border border-border rounded-xl flex flex-col gap-y-2 px-4 py-4">
        <p className="text-lg font-medium">Payment Method</p>

        <p className="text-sm text-foreground/70">Cod --- NEED UPDATE ---</p>
      </div>
    </div>
  );
};

export default ReviewInfoStep;
