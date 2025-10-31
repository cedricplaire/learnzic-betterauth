import { ForgotPasswordForm } from "@/components/forgot-password-form";
import ReturnButton from "@/components/return-button";

export default async function Page() {

  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/auth/login" label="Login" />

        <h1 className="text-3xl font-bold">Reset Password</h1>
      </div>
      <p className="text-destructive">
        Please enter your email address to receive a password reset link
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
