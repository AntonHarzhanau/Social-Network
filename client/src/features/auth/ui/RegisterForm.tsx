import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/shared/components/ui/field";
import { useAuthStore } from "@/features/auth/model/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput } from "@/shared/components/FormInput";
import {
  registerFormSchema,
  type RegisterFormSchema,
} from "@/features/auth/model/registerFormSchema";
import { DatePicker } from "@/shared/components/DatePicker";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { registerApiSchema } from "@/features/auth/model/registerApiSchema";

const RegisterForm = ({ switchToLogin }: { switchToLogin: () => void }) => {
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      dateOfBirth: undefined,
      password: "",
      confirmPassword: "",
    },
  });
  const { register } = useAuthStore();

  const handleSubmit = async (data: RegisterFormSchema) => {
    const payload = registerApiSchema.parse(data);
    try {
      await register(payload);
      
      toast.success("Registration successful! Please log in.", {
        closeButton: true,
      });
      switchToLogin();
    } catch (error: AxiosError | any) {
      console.error("Registration error:", error);
      toast.error(
        `Registration failed: ${error.response?.data?.error || error.message}`,
        { closeButton: true },
      );
    }
  };

  return (
    <form
      id="register-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="p-6 md:py-2"
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold mt-1">Create your account</h1>
        </div>

        <FormInput
          name="email"
          control={form.control}
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="m@example.com"
        />

        <div className="flex gap-4">
          <FormInput
            name="firstName"
            control={form.control}
            label="First Name"
            type="text"
            autoComplete="given-name"
          />

          <FormInput
            name="lastName"
            control={form.control}
            label="Last Name"
            type="text"
            autoComplete="family-name"
          />
        </div>

        <DatePicker
          name="dateOfBirth"
          control={form.control}
          label="Date of Birth"
        />

        <div className="flex gap-4">
          <FormInput
            name="password"
            control={form.control}
            label="Password"
            type="password"
            autoComplete="new-password"
          />

          <FormInput
            name="confirmPassword"
            control={form.control}
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
          />
        </div>

        <Field>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Create Account
          </Button>
        </Field>

        <FieldDescription className="text-center md:mb-2">
          Already have an account?{" "}
          <Button type="button" variant="link" onClick={switchToLogin}>
            Sign in
          </Button>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
