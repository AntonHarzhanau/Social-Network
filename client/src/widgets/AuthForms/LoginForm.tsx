import GoogleIconButton from "@/shared/components/GoogleIconButton";
import { Button } from "@/shared/components/ui/button";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/shared/components/ui/field";
import { useAuthStore } from "@/shared/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput } from "@/shared/components/FormInput";
import {
  loginFormSchema,
  type LoginFormSchema,
} from "@/shared/types/loginFormSchema";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";

const LoginForm = ({
  onSwitchToRegister,
}: {
  onSwitchToRegister: () => void;
}) => {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (data: LoginFormSchema) => {
    try {
      await login(data.email, data.password);
      console.log("Login successful, redirecting...");  
      navigate(ROUTES.HOME, { replace: true });
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  return (
    <form
      id="login-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="p-6 md:p-8"
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground text-balance">
            Login to your account
          </p>
        </div>
        <FormInput
          name="email"
          control={form.control}
          label="Email"
          type="email"
          placeholder="m@example.com"
          autoComplete="email"
        />

        <FormInput
          name="password"
          control={form.control}
          label="Password"
          type="password"
          autoComplete="current-password"
        />

        <Field>
          <Button type="submit" form="login-form" disabled={form.formState.isSubmitting} className="w-full">
            Login
          </Button>
        </Field>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Or continue with
        </FieldSeparator>
        <Field className="flex">
          <GoogleIconButton />
        </Field>
        <FieldDescription className="text-center">
          Don&apos;t have an account?{" "}
          <Button type="button" variant="link" onClick={onSwitchToRegister}>
            Sign up
          </Button>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
