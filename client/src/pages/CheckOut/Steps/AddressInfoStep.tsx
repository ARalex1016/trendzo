import { useFormContext } from "react-hook-form";

// Components
import { Form } from "@/components/ui/form";

// Hooks
import { useFirstStepError } from "@/hooks/useFirstStepError";

// Icons
import { MapPin, Check } from "lucide-react";

// Types
import type {
  CheckoutSchemaType,
  AddressStepSchemaType,
} from "@/validations/checkout.validator";

// Store
import useAuthStore from "@/store/useAuthStore";

// Types
import type { IAddress } from "@/types/user.types";

const AddressInfoStep = () => {
  const { user } = useAuthStore();

  const form = useFormContext<CheckoutSchemaType>();

  const { firstErrorPath } = useFirstStepError<AddressStepSchemaType>();

  const selectedAddressId = form.watch("deliveryAddress._id");

  const handleSelectAddress = (address: IAddress) => {
    form.setValue(
      "deliveryAddress",
      {
        _id: address._id,
        label: address.label,
        fullName: address.fullName,
        phone: address.phone,
        street: address.street,
        area: address.area,
        city: address.city,
        state: address.state ?? "",
        country: address.country,
        postalCode: address.postalCode ?? "",
        landmark: address.landmark,
      },
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  return (
    <Form {...form}>
      <div className="w-full flex flex-col gap-y-4 py-4">
        {/* Addresses  */}
        {user?.addresses.map((address) => {
          const isSelected = selectedAddressId === address._id;

          return (
            <label
              key={address._id}
              htmlFor={address._id}
              className={`w-full rounded-lg border flex flex-col gap-y-1 px-3 py-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] relative ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-accent"
              }`}
            >
              <input
                id={address._id}
                type="radio"
                checked={isSelected}
                onChange={() => handleSelectAddress(address)}
                className="sr-only"
              />

              {/* Check Icon */}
              {isSelected && (
                <div className="size-5 flex shrink-0 items-center justify-center rounded-full border transition absolute top-4 right-3 border-primary bg-primary text-primary-foreground">
                  <Check size={"15px"} />
                </div>
              )}

              <div className="flex flex-row items-center gap-x-2">
                <MapPin size={"16px"} className="text-primary" />

                <p className="text-base text-foreground font-medium">
                  {address.fullName}
                </p>

                <span className="text-sm bg-primary/70 rounded-md px-2">
                  {address.label}
                </span>
              </div>

              <p className="text-sm text-foreground/70">
                {address.street}, {address.city}
              </p>

              <p className="text-sm text-foreground/70">
                {address.state} - {address.postalCode}
              </p>

              <p className="text-sm text-foreground/70">
                {address.phone}, {address.email}
              </p>
            </label>
          );
        })}
      </div>
    </Form>
  );
};

export default AddressInfoStep;
