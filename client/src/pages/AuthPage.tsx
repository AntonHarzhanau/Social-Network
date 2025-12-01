import { Card, CardContent } from "@/shared/components/ui/card";
import { FieldDescription } from "@/shared/components/ui/field";
import LoginForm from "@/widgets/AuthForms/LoginForm";
import RegisterForm from "@/widgets/AuthForms/RegisterForm";
import { useState } from "react";

type Authmode = "login" | "register";

const LoginPage = () => {
  const [mode, setMode] = useState<Authmode>("register");

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              {mode === "login" ? (
                <LoginForm onSwitchToRegister={() => setMode("register")} />
              ) : (
                <RegisterForm switchToLogin={() => setMode("login")} />
              )}
              <div className="bg-muted relative hidden md:block">
                <img
                  src="/placeholder.svg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>

          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
