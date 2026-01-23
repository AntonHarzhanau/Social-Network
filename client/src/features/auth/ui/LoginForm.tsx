import GoogleIconButton from "@/shared/components/GoogleIconButton";
import { Button } from "@/shared/components/ui/button";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/shared/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput } from "@/shared/components/FormInput";
import {
  loginFormSchema,
  type LoginFormSchema,
} from "@/features/auth/model/loginFormSchema";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import EmailVerificationNotice from "@/features/auth/ui/EmailVerificationNotice";
import { authActions } from "@/features/auth/model/authActions";

function safeRedirectTo(value: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  return value;
}

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

  const navigate = useNavigate();

  const [emailVerification, setEmailVerification] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("email-verify-status");
    if (status !== "ok") return;

    toast.success("Email successfully verified! You can now log in.", {
      closeButton: true,
    });

    const next = new URLSearchParams(searchParams);
    next.delete("email-verify-status");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleSubmit = async (data: LoginFormSchema) => {
    try {
      await authActions.login(data);

      const redirectTo = safeRedirectTo(searchParams.get("redirectTo"));
      navigate(redirectTo ?? ROUTES.HOME, { replace: true });
    } catch (error: AxiosError | any) {
      const message = error.response?.data?.message || error.message;
      if (message === "Email not verified.") {
        setEmailVerification(true);
      } else if (message) {
        toast.error(message, { closeButton: true });
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          closeButton: true,
        });
      }
    }
  };

  return (
    <>
      {emailVerification && (
        <EmailVerificationNotice
          email={form.getValues("email")}
          onClose={() => setEmailVerification(false)}
        />
      )}
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
            <Button
              type="submit"
              form="login-form"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
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
    </>
  );
};

export default LoginForm;
