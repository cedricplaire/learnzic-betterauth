import ReturnButton from "@/components/return-button";
import { SendVerificaionEmailForm } from "@/components/send-verification-email-form";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ error: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const error = (await searchParams).error;
  if (!error) redirect("/profile");

  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/auth/login" label="Login" />

        <h1 className="text-3xl font-bold">Verify Email</h1>

        <p className="text-destructive">
          {error === "invalid_token" || error === "token_expired"
            ? "Your token is invalid or expire. Please request a new one."
            : error === "email_not_verified"
            ? "Please verify your EMail or request a new one below"
            : "Oops! Something went wrong. Please try again."}
        </p>
        
      </div>
      <SendVerificaionEmailForm />
    </div>
  );
}
