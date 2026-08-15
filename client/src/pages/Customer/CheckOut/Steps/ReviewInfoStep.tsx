import { useFormContext } from "react-hook-form";

// Utils
import { capitalize } from "@/utils/StringManager";

// Types
import { type CheckoutSchemaType } from "@/validations/checkout.validator";

const ReviewInfoStep = () => {
  const form = useFormContext<CheckoutSchemaType>();

  const details = form.getValues();

  return (
    <div className="flex flex-col gap-y-4 py-4">
      {/* User Details */}
      <div className="bg-accent border border-border rounded-xl flex flex-col gap-y-2 px-4 py-4">
        <p className="text-lg font-medium">User Details</p>

        <p className="text-sm text-foreground/70">
          {details.user.fullName}, {details.user.phone}, {details.user.email}
          {/* Durbar Marg, Ward 3, Kathmandu - 44600 --- NEED UPDATE --- */}
        </p>
      </div>

      {/* Delivery Details */}
      <div className="bg-accent border border-border rounded-xl flex flex-col gap-y-2 px-4 py-4">
        <p className="text-lg font-medium">Delivery Details</p>

        <p className="text-sm text-foreground/70">
          {details.deliveryAddress.street},{details.deliveryAddress.area},
          {details.deliveryAddress.state} - {details.deliveryAddress.postalCode}
          {/* Durbar Marg, Ward 3, Kathmandu - 44600 --- NEED UPDATE --- */}
        </p>
      </div>

      {/* Payment Method */}
      <div className="bg-accent border border-border rounded-xl flex flex-col gap-y-2 px-4 py-4">
        <p className="text-lg font-medium">Payment Method</p>

        <p className="text-sm text-foreground/70">
          {capitalize(details.paymentMethod)}
          {/* Cod --- NEED UPDATE --- */}
        </p>
      </div>
    </div>
  );
};

export default ReviewInfoStep;
