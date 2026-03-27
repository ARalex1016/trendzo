import { useFormContext } from "react-hook-form";

// Components
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputFieldWithLabelNIcon } from "@/components/InputFields";
import { Button } from "@/components/ui/button";

// Icons
import {
  MapPin,
  Check,
  User,
  Phone,
  Mail,
  Home,
  Building2,
  Globe,
  Hash,
  Plus,
  Pen,
} from "lucide-react";

// Types
import type { CheckoutSchemaType } from "@/validations/checkout.validator";

type SavedAddress = {
  id: string;
  label?: string;
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  country?: string;
  postalCode: string;
};

const addresses: SavedAddress[] = [
  {
    id: "home",
    label: "Home",
    name: "Aslam",
    phone: "+977 9873821",
    email: "aslam@gmail.com",
    street: "Starda D18",
    city: "Constanta",
    state: "Constanta",
    country: "Romania",
    postalCode: "9808722",
  },
  {
    id: "office",
    label: "Office",
    name: "Aslam",
    phone: "+977 9873821",
    email: "aslam@gmail.com",
    street: "Street B12",
    city: "Bucharest",
    state: "Bucharest",
    country: "Romania",
    postalCode: "123456",
  },
  {
    id: "other",
    label: "Other",
    name: "Aslam",
    phone: "+977 9873821",
    email: "aslam@gmail.com",
    street: "Street C10",
    city: "Cluj",
    state: "Cluj",
    country: "Romania",
    postalCode: "654321",
  },
];

const AddressInfoStep = () => {
  const form = useFormContext<CheckoutSchemaType>();

  const selectedAddressId = form.watch("selectedAddressId");
  const addressMode = form.watch("addressMode");

  const handleSelectAddress = (address: SavedAddress) => {
    form.setValue("selectedAddressId", address.id, { shouldValidate: true });
    form.setValue("addressMode", "saved");
    form.setValue(
      "address",
      {
        label: address.label ?? "",
        name: address.name,
        phone: address.phone,
        email: address.email,
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country ?? "",
        postalCode: address.postalCode,
      },
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const handleAddNewAddress = () => {
    form.setValue("addressMode", "new");
    form.setValue("selectedAddressId", undefined);
    form.setValue(
      "address",
      {
        label: "",
        name: "",
        phone: "",
        email: "",
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      },
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const handleCancleNewAddress = () => {
    form.setValue("addressMode", "saved");
  };

  const handleSaveNewAddress = async () => {
    const isValid = await form.trigger([
      "address.label",
      "address.name",
      "address.phone",
      "address.email",
      "address.street",
      "address.city",
      "address.state",
      "address.country",
      "address.postalCode",
    ]);

    if (!isValid) return;

    const newAddressValues = form.getValues("address");

    const newAddress: SavedAddress = {
      id: crypto.randomUUID(),
      label: newAddressValues.label?.trim() || "Other",
      name: newAddressValues.name.trim(),
      phone: newAddressValues.phone.trim(),
      email: newAddressValues.email.trim(),
      street: newAddressValues.street.trim(),
      city: newAddressValues.city.trim(),
      state: newAddressValues.state.trim(),
      country: newAddressValues.country?.trim() || "",
      postalCode: newAddressValues.postalCode.trim(),
    };

    // setAddresses((prev) => [...prev, newAddress]);

    form.setValue("selectedAddressId", newAddress.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    form.setValue("addressMode", "saved");

    form.setValue(
      "address",
      {
        label: newAddress.label,
        name: newAddress.name,
        phone: newAddress.phone,
        email: newAddress.email,
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
        {addresses.map((address, index) => {
          const isSelected =
            addressMode === "saved" && selectedAddressId === address.id;

          return (
            <label
              key={address.id}
              htmlFor={`address-${index}`}
              className={`w-full rounded-lg border flex flex-col gap-y-1 px-3 py-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] relative ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-accent"
              }`}
            >
              <input
                id={`address-${index}`}
                type="radio"
                checked={isSelected}
                onChange={() => handleSelectAddress(address)}
                className="sr-only"
              />

              <div
                className={`size-5 flex shrink-0 items-center justify-center rounded-full border transition absolute top-4 right-3 ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "invisible"
                }`}
              >
                {isSelected && <Check size={"15px"} />}
              </div>

              <div className="flex flex-row items-center gap-x-2">
                <MapPin size={"16px"} className="text-primary" />

                <p className="text-base text-foreground font-medium">
                  {address.name}
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
                name="address.name"
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
                name="address.email"
                render={({ field }) => (
                  <FormItem>
                    <InputFieldWithLabelNIcon
                      label="Email Address"
                      Icon={Mail}
                      {...field}
                      value={field.value ?? ""}
                      placeholder="your@email.com"
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
              <Button onClick={handleSaveNewAddress} className="flex-1 py-5">
                Save Address
              </Button>

              <Button
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
