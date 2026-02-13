import { useNavigate } from "react-router-dom";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/ui/password";

// Validation
import { loginSchema, type UserLoginType } from "@/validations/user.validator";

// Hooks
import { useFirstStepError } from "@/hooks/useFirstStepError";

// Store
import useAuthStore from "@/store/useAuthStore";

/* ---------------------------------------------
   CHILD FORM (has access to FormProvider)
--------------------------------------------- */
const LoginForm = ({
  onSubmit,
}: {
  onSubmit: (data: UserLoginType) => void;
}) => {
  const methods = useFormContext<UserLoginType>();
  const { firstErrorPath } = useFirstStepError<UserLoginType>();

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-x-2 gap-y-4"
    >
      {/* Email */}
      <FormField
        control={methods.control}
        name="email"
        render={({ field }) => (
          <FormItem className="col-span-2 gap-1">
            <Input
              {...field}
              value={field.value ?? ""}
              type="email"
              placeholder="Email"
            />
            {firstErrorPath === "email" && <FormMessage />}
          </FormItem>
        )}
      />

      {/* Password */}
      <FormField
        control={methods.control}
        name="password"
        render={({ field }) => (
          <FormItem className="col-span-2 gap-1">
            <PasswordInput
              {...field}
              value={field.value ?? ""}
              placeholder="Password"
            />
            {firstErrorPath === "password" && <FormMessage />}
          </FormItem>
        )}
      />

      <div className="col-span-2">
        <Button type="submit" className="w-full">
          Log in
        </Button>
      </div>
    </form>
  );
};

/* ---------------------------------------------
   PARENT COMPONENT
--------------------------------------------- */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const methods = useForm<UserLoginType>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
    shouldFocusError: true,
  });

  const onSubmit = async (data: UserLoginType) => {
    try {
      await login(data);

      navigate("/products");
    } catch (error) {}
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">
            Enter your credentials to log in
          </CardTitle>
        </CardHeader>

        <CardContent>
          <FormProvider {...methods}>
            <LoginForm onSubmit={onSubmit} />
          </FormProvider>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm font-light">
            Don't have an account?
            <Button
              variant="link"
              className="px-1 font-bold"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
