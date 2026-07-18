import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Lib
import { cn } from "@/lib/utils";

// Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { InputFieldWithLabelNIcon } from "@/components/InputFields";

// Icons
import {
  Pen,
  MapPin,
  User,
  Phone,
  Home,
  Building2,
  Globe,
  Hash,
  Loader,
} from "lucide-react";

// Validation
import { addressStepSchema } from "@/validations/checkout.validator";

// Store
import useUserStore from "@/store/useUserStore";

// Types
import type { AddressStepSchemaType } from "@/validations/checkout.validator";

interface NewAddressProps {
  open: boolean;
  onClose: () => void;
}

interface SwitchCardProps {
  isActive: boolean;
  onChange: (value: boolean) => void;
}

const SwitchCard = ({ isActive, onChange }: SwitchCardProps) => {
  return (
    <label
      className={cn(
        "rounded-lg border flex flex-row justify-between items-center px-3 sm:px-5 py-2",
        isActive
          ? "bg-primary/10 border-primary/30"
          : "bg-accent border-border",
      )}
    >
      <div className="space-y-1">
        <p className="text-xs text-foreground font-medium">
          Set as default address
        </p>

        <p className="text-[10px] text-foreground/60">
          This will be your primary delivery address
        </p>
      </div>

      <Switch checked={isActive} onCheckedChange={onChange} />
    </label>
  );
};

const NewAddress = ({ open, onClose }: NewAddressProps) => {
  const { addAddress } = useUserStore();

  const [isSavingAddress, setIsSavingAddress] = useState<boolean>(false);

  const defaultValues: AddressStepSchemaType = {
    address: {
      label: "",
      fullName: "",
      phone: "",
      street: "",
      area: "",
      city: "",
      state: "",
      country: "Nepal",
      postalCode: "",
      landmark: "",
      isDefault: false,
    },
  };

  const methods = useForm<AddressStepSchemaType>({
    resolver: zodResolver(addressStepSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldUnregister: false, // important for multi-step forms
    criteriaMode: "firstError", // ✅ IMPORTANT
    shouldFocusError: true, // ✅ Focus first invalid field
    defaultValues,
  });

  const { control, handleSubmit, reset } = methods;

  const handleSaveNewAddress = async (data: AddressStepSchemaType) => {
    setIsSavingAddress(true);

    try {
      await addAddress(data);

      // Reset Inputs
      // reset();

      // Close New Address Dialog
      // onClose();
    } catch (error) {
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handlReset = () => {
    reset(defaultValues);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="flex flex-col items-start">
          <DialogTitle>
            <div className="flex flex-row items-center gap-x-2">
              <Pen size={"18px"} className="text-primary" />
              <p className="font-medium">New Address</p>
            </div>
          </DialogTitle>

          <DialogDescription className="text-sm text-left text-foreground/60">
            Enter your address details to save this location for future use.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <Form {...methods}>
            <form
              onSubmit={handleSubmit(handleSaveNewAddress)}
              className="space-y-4"
            >
              {/* Form Inputs */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-y-3">
                <FormField
                  control={methods.control}
                  name="address.label"
                  render={({ field }) => (
                    <FormItem>
                      <InputFieldWithLabelNIcon
                        label="Label"
                        labelClassName="text-xs"
                        inputClassName="text-sm"
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
                  control={methods.control}
                  name="address.fullName"
                  render={({ field }) => (
                    <FormItem>
                      <InputFieldWithLabelNIcon
                        label="Recipient Name"
                        labelClassName="text-xs"
                        inputClassName="text-sm"
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
                  control={methods.control}
                  name="address.phone"
                  render={({ field }) => (
                    <FormItem>
                      <InputFieldWithLabelNIcon
                        label="Phone Number"
                        labelClassName="text-xs"
                        inputClassName="text-sm"
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
                  control={methods.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem>
                      <InputFieldWithLabelNIcon
                        label="Country"
                        labelClassName="text-xs"
                        inputClassName="text-sm"
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
                  control={methods.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <InputFieldWithLabelNIcon
                        label="City"
                        labelClassName="text-xs"
                        inputClassName="text-sm"
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
                  control={methods.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <InputFieldWithLabelNIcon
                        label="State"
                        labelClassName="text-xs"
                        inputClassName="text-sm"
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
                  control={methods.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <InputFieldWithLabelNIcon
                        label="Street Address"
                        labelClassName="text-xs"
                        inputClassName="text-sm"
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
                  control={methods.control}
                  name="address.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <InputFieldWithLabelNIcon
                        label="Postal Code"
                        labelClassName="text-xs"
                        inputClassName="text-sm"
                        Icon={Hash}
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Postal code"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="address.area"
                  render={({ field }) => (
                    <FormItem>
                      <InputFieldWithLabelNIcon
                        label="Area"
                        labelClassName="text-xs"
                        inputClassName="text-sm"
                        Icon={MapPin}
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Area / District"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="address.landmark"
                  render={({ field }) => (
                    <FormItem>
                      <InputFieldWithLabelNIcon
                        label="Landmark"
                        labelClassName="text-xs"
                        inputClassName="text-sm"
                        Icon={MapPin}
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Nearby landmark"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="address.isDefault"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <SwitchCard
                        isActive={field.value}
                        onChange={field.onChange}
                      />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row gap-x-3">
                <Button
                  type="button"
                  variant={"destructive"}
                  onClick={handlReset}
                  className="py-4 sm:py-5"
                >
                  Reset
                </Button>

                <Button
                  type="submit"
                  disabled={isSavingAddress}
                  className="flex-1 py-4 sm:py-5 enabled:cursor-pointer disabled:cursor-not-allowed! disabled:bg-accent!"
                >
                  <span>Save Address</span>

                  {isSavingAddress && <Loader className="animate-spin" />}
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default NewAddress;
