"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { sendVerificationEmail } from "@/lib/auth-client";
import { toast } from "sonner";

export const SendVerificaionEmailForm = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);
    const email = String(formData.get("email"));
    if (!email) return toast.error("Please enter your email");
    await sendVerificationEmail({
      email,
      callbackURL: "/auth/verify",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Verification email sent successfuly");
          router.push("/auth/verify/success");
        },
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">EMail</Label>
        <Input type="email" id="email" name="email" />
      </div>
      <Button type="submit" disabled={isPending}>
        Re-Send Verification EMail
      </Button>
    </form>
  );
};
