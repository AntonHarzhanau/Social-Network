import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import axios from "axios";

interface EmailVerificationNoticeProps {
  email: string;
  onClose: () => void;
}

const EmailVerificationNotice = ({
  email,
  onClose,
}: EmailVerificationNoticeProps) => {
  const sentEmailVerificationRequest = async (email: string) => {
    console.log("Resending email verification to:", email);
    await axios.post("http://localhost:8000/api/auth/resend-email-verification", { email: email });
  };
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center p-4 bg-background/50 z-20">
      <form className="max-w-md w-full bg-card p-6 rounded shadow">
        <Input type="email" value={email} disabled />
        <p className="text-sm text-muted-foreground mt-2">
          Please verify your email address. If you did not receive the email,
          click the button below to resend the verification email.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            onClick={() => sentEmailVerificationRequest(email)}
            className=""
          >
            Resend Verification Email
          </Button>
          <Button type="button" onClick={onClose} className="">
            Close
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmailVerificationNotice;
