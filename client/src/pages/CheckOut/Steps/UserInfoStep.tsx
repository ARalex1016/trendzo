import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

// Components
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputFieldWithLabelNIcon } from "@/components/InputFields";

// Hooks
import { useFirstStepError } from "@/hooks/useFirstStepError";

// Store
import useAuthStore from "@/store/useAuthStore";

// Icons
import { Phone, User, Mail } from "lucide-react";

// Types
import { type UserStepSchemaType } from "@/validations/checkout.validator";

const UserInfoStep = () => {
  const form = useFormContext<UserStepSchemaType>();

  const { user } = useAuthStore();

  const { firstErrorPath } = useFirstStepError<UserStepSchemaType>();

  const [isRecipientSelf, setIsRecipientSelf] = useState<boolean>(true);

  useEffect(() => {
    const nextFullName = isRecipientSelf ? (user?.name ?? "") : "";
    const nextPhone = isRecipientSelf ? (user?.phone ?? "") : "";
    const nextEmail = isRecipientSelf ? (user?.email ?? "") : "";

    if (form.getValues("user.fullName") !== nextFullName) {
      form.setValue("user.fullName", nextFullName, {
        shouldValidate: true,
        shouldDirty: false,
        shouldTouch: false,
      });
    }

    if (form.getValues("user.phone") !== nextPhone) {
      form.setValue("user.phone", nextPhone, {
        shouldValidate: true,
        shouldDirty: false,
        shouldTouch: false,
      });
    }

    if (form.getValues("user.email") !== nextEmail) {
      form.setValue("user.email", nextEmail, {
        shouldValidate: true,
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [isRecipientSelf, user?.name, user?.phone, user?.email]);

  return (
    <Form {...form}>
      {/* Receiver Readio Button */}
      <div className="flex flex-col gap-y-1">
        <p className="text-foreground/80 font-medium">
          Who will receive this order?
        </p>

        <label htmlFor="self" className="text-foreground/80 pl-2">
          <input
            type="radio"
            name="receiver"
            id="self"
            checked={isRecipientSelf === true}
            onChange={() => setIsRecipientSelf(true)}
          />{" "}
          I am the receiver
        </label>

        <label htmlFor="other" className="text-foreground/80 pl-2">
          <input
            type="radio"
            name="receiver"
            id="other"
            checked={isRecipientSelf === false}
            onChange={() => setIsRecipientSelf(false)}
          />{" "}
          Someone else
          <span className="text-foreground/50">
            (Enter their name and contact details below)
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 py-4">
        <FormField
          control={form.control}
          name="user.fullName"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Name</FormLabel> */}
              <InputFieldWithLabelNIcon
                label="Full Name"
                Icon={User}
                {...field}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Enter your full name"
              />
              {firstErrorPath === "user.fullName" && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user.phone"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Name</FormLabel> */}
              <InputFieldWithLabelNIcon
                label="Phone Number"
                Icon={Phone}
                {...field}
                type="tel"
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="+977 9841234567"
              />
              {firstErrorPath === "user.phone" && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user.email"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Name</FormLabel> */}
              <InputFieldWithLabelNIcon
                label="Email Address"
                Icon={Mail}
                {...field}
                type="email"
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="your@email.com"
              />
              {firstErrorPath === "user.email" && <FormMessage />}
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};

export default UserInfoStep;
