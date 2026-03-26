import { useFormContext } from "react-hook-form";

// Components
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputFieldWithLabelNIcon } from "@/components/InputFields";

// Hooks
import { useFirstStepError } from "@/hooks/useFirstStepError";

// Icons
import { Phone, User, Mail, Lock } from "lucide-react";

// Types
import { type UserStepSchemaType } from "@/validations/checkout.validator";

const UserInfoStep = () => {
  const form = useFormContext<UserStepSchemaType>();

  const { firstErrorPath } = useFirstStepError<UserStepSchemaType>();

  return (
    <Form {...form}>
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

        <FormField
          control={form.control}
          name="user.password"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Name</FormLabel> */}
              <InputFieldWithLabelNIcon
                label="Password"
                Icon={Lock}
                {...field}
                type="password"
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Password"
              />
              {firstErrorPath === "user.password" && <FormMessage />}
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};

export default UserInfoStep;
