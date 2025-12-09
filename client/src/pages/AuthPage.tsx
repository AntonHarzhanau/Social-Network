import { ModeToggle } from "@/shared/components/ModeToggle";
import { Card, CardContent } from "@/shared/components/ui/card";
import { FieldDescription } from "@/shared/components/ui/field";
import LoginForm from "@/widgets/AuthForms/LoginForm";
import RegisterForm from "@/widgets/AuthForms/RegisterForm";
import { useState } from "react";

type Authmode = "login" | "register";

const AuthPage = () => {
  const [mode, setMode] = useState<Authmode>("login");

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="bg-muted relative hidden md:block">
                <div className="flex flex-col justify-center items-center h-full">
                  <h1 className="text-5xl font-extrabold">LOGO</h1>
                  <h1 className="text-3xl text-bold">Simple. Clear. Friendly.</h1>
                </div>
              </div>
              {mode === "login" ? (
                <LoginForm onSwitchToRegister={() => setMode("register")} />
              ) : (
                <RegisterForm switchToLogin={() => setMode("login")} />
              )}

            </CardContent>
          </Card>

          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            <ModeToggle /> {/* TODO: for test */}
          </FieldDescription>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
export const Component = AuthPage;
