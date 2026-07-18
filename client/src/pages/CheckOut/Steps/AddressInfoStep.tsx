import { useFormContext } from "react-hook-form";

// Components
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputFieldWithLabelNIcon } from "@/components/InputFields";
import { Button } from "@/components/ui/button";

// Hooks
import { useFirstStepError } from "@/hooks/useFirstStepError";

// Icons
import {
  MapPin,
  Check,
  User,
  Phone,
  Home,
  Building2,
  Globe,
  Hash,
  Plus,
  Pen,
} from "lucide-react";

// Types
import type {
  CheckoutSchemaType,
  AddressStepSchemaType,
} from "@/validations/checkout.validator";

// Store
import useAuthStore from "@/store/useAuthStore";

// Types
import type { IAddress } from "@/types/user.types";

type SavedAddress = {
  id: string;
  label?: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country?: string;
  postalCode: string;
};

const emptyAddress: CheckoutSchemaType["address"] = {
  _id: "",
  label: "",
  fullName: "",
  phone: "",
  street: "",
  area: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  landmark: "",
};

const AddressInfoStep = () => {
  const { user } = useAuthStore();

  const form = useFormContext<CheckoutSchemaType>();

  const { firstErrorPath } = useFirstStepError<AddressStepSchemaType>();

  const selectedAddressId = form.watch("address._id");
  const addressMode = form.watch("addressMode");

  const handleSelectAddress = (address: IAddress) => {
    form.setValue("addressMode", "saved");
    form.setValue(
      "address",
      {
        _id: address._id,
        label: address.label ?? "",
        fullName: address.fullName ?? user?.name,
        phone: address.phone ?? user?.phone,
        street: address.street,
        area: address.area ?? "",
        city: address.city,
        state: address?.state || "",
        country: address.country ?? "",
        postalCode: address.postalCode ?? "",
        landmark: address.landmark ?? "",
      },
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const handleAddNewAddress = () => {
    form.setValue("addressMode", "new");
    form.setValue("address", emptyAddress, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleCancleNewAddress = () => {
    form.setValue("addressMode", "saved");
  };

  const handleSaveNewAddress = async () => {
    const isValid = await form.trigger([
      "address._id",
      "address.label",
      "address.fullName",
      "address.phone",
      "address.street",
      "address.area",
      "address.city",
      "address.state",
      "address.country",
      "address.postalCode",
      "address.landmark",
    ]);

    if (!isValid) return;

    const newAddressValues = form.getValues("address");

    const newAddress: SavedAddress = {
      id: crypto.randomUUID(),
      label: newAddressValues.label?.trim() || "Other",
      name: newAddressValues.fullName.trim(),
      phone: newAddressValues.phone.trim(),
      street: newAddressValues.street.trim(),
      city: newAddressValues.city.trim(),
      state: newAddressValues.state.trim(),
      country: newAddressValues.country?.trim() || "",
      postalCode: newAddressValues.postalCode.trim(),
    };

    form.setValue("addressMode", "saved");

    form.setValue(
      "address",
      {
        _id: newAddress.id,
        label: newAddress.label,
        fullName: newAddress.name,
        phone: newAddress.phone,
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        country: newAddress.country ?? "",
        postalCode: newAddress.postalCode,
      },

      { shouldValidate: true, shouldDirty: true },
    );
  };

  return (
    <Form {...form}>
      <div className="w-full flex flex-col gap-y-4 py-4">
        {/* Addresses  */}
        {user?.addresses.map((address) => {
          const isSelected =
            addressMode === "saved" && selectedAddressId === address._id;

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

        {/* Button -> Add New Address */}
        {addressMode !== "new" && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAddNewAddress}
            className="p-5 border-dashed hover:scale-[101%]"
          >
            <Plus />

            <span>Add New Address</span>
          </Button>
        )}

        {/* Form -> New Address */}
        {addressMode === "new" && (
          <div className="bg-accent rounded-lg border border-border px-3 py-4 my-2">
            <div className="flex flex-row items-center gap-x-2">
              <Pen size={"18px"} className="text-primary" />
              <p className="font-medium">New Address</p>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pt-4">
              <FormField
                control={form.control}
                name="address.label"
                render={({ field }) => (
                  <FormItem>
                    <InputFieldWithLabelNIcon
                      label="Label"
                      Icon={MapPin}
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Home / Office / Other"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.fullName"
                render={({ field }) => (
                  <FormItem>
                    <InputFieldWithLabelNIcon
                      label="Recipient Name"
                      Icon={User}
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Enter recipient name"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.phone"
                render={({ field }) => (
                  <FormItem>
                    <InputFieldWithLabelNIcon
                      label="Phone Number"
                      Icon={Phone}
                      {...field}
                      value={field.value ?? ""}
                      placeholder="+977 9841234567"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <InputFieldWithLabelNIcon
                      label="Street Address"
                      Icon={Home}
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Street / Area / House No."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <InputFieldWithLabelNIcon
                      label="City"
                      Icon={Building2}
                      {...field}
                      value={field.value ?? ""}
                      placeholder="City"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <InputFieldWithLabelNIcon
                      label="State"
                      Icon={Building2}
                      {...field}
                      value={field.value ?? ""}
                      placeholder="State"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem>
                    <InputFieldWithLabelNIcon
                      label="Country"
                      Icon={Globe}
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Country"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.postalCode"
                render={({ field }) => (
                  <FormItem>
                    <InputFieldWithLabelNIcon
                      label="Postal Code"
                      Icon={Hash}
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Postal code"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row gap-x-3 mt-4">
              <Button
                type="button"
                onClick={handleSaveNewAddress}
                className="flex-1 py-5"
              >
                Save Address
              </Button>

              <Button
                type="button"
                variant={"outline"}
                onClick={handleCancleNewAddress}
                className="py-5"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Form>
  );
};

export default AddressInfoStep;
