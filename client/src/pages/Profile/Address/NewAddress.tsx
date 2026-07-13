import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputFieldWithLabelNIcon } from "@/components/InputFields";

// Icons
import {
  Pen,
  MapPin,
  User,
  Phone,
  Mail,
  Home,
  Building2,
  Globe,
  Hash,
} from "lucide-react";

// Validation
import { addressStepSchema } from "@/validations/checkout.validator";

// Types
import type { AddressStepSchemaType } from "@/validations/checkout.validator";

const NewAddress = () => {
  const defaultValues: AddressStepSchemaType = {
    address: {
      label: "",
      fullName: "",
      phone: "",
      email: "",
      street: "",
      area: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      landmark: "",
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

  const handleSaveNewAddress = (data: AddressStepSchemaType) => {
    console.log(data);

    // save address
  };

  const handleCancleNewAddress = () => {
    reset(defaultValues);
  };

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={handleSubmit(handleSaveNewAddress)}>
          <div className="bg-accent/60 rounded-lg border border-border px-3 py-4">
            <div className="flex flex-row items-center gap-x-2">
              <Pen size={"18px"} className="text-primary" />
              <p className="font-medium">New Address</p>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pt-4">
              <FormField
                control={methods.control}
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
                control={methods.control}
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
                control={methods.control}
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
                control={methods.control}
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
                control={methods.control}
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
                control={methods.control}
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
                control={methods.control}
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
                control={methods.control}
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
                control={methods.control}
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

              <FormField
                control={control}
                name="address.area"
                render={({ field }) => (
                  <FormItem>
                    <InputFieldWithLabelNIcon
                      label="Area"
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
                      Icon={MapPin}
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Nearby landmark"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row gap-x-3 mt-4">
              <Button
                type="submit"
                // onClick={handleSaveNewAddress}
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
        </form>
      </Form>
    </FormProvider>
  );
};

export default NewAddress;
