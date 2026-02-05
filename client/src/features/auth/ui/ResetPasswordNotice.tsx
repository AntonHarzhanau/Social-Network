import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { authApi } from "../api/authApi";
import { toast } from "sonner";
import { useState } from "react";

interface ResetPasswordNoticeProps {
  onClose: () => void;
}

const ResetPasswordNotice = ({
  onClose,
}: ResetPasswordNoticeProps) => {
  const [email, setEmail] = useState("");
  const sentEmailVerificationRequest = async (email: string) => {
    authApi.resetPassword(email)
    toast.success("Password reset email sent! Please check your inbox.", {
      closeButton: true,
    });
    onClose()
   
  };
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center p-4 bg-background/50 z-20">
      <form className="max-w-md w-full bg-card p-6 rounded shadow">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <p className="text-sm text-muted-foreground mt-2">
          Please verify your email address. If you did not receive the email,
          click the button below to resend the verification email.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            disabled={!email}
            onClick={() => sentEmailVerificationRequest(email)}
            className=""
          >
            Resend Verification Email
          </Button>
          <Button  type="button" onClick={onClose} className="">
            Close
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordNotice;
