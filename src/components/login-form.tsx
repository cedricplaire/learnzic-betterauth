"use client"

import { signInEmailAction } from "@/actions/sign-in-email-action";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    setIsPending(true);

    const formData = new FormData(evt.currentTarget);

    const { error } = await signInEmailAction(formData);

    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      toast.success("Login successful. Good to have you back.");
      router.push("/profile");
    }
  }
    return (
      <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input type="email" name="email" id="email"></Input>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center gap-2">
            <Label htmlFor="password">Password</Label>
            <Link 
              href="/auth/forgot-password"
              className="text-sm italic text-muted-foreground hover:text-foreground"
            >
              Forgot Password ?
            </Link>
          </div>

          <Input type="password" name="password" id="password"></Input>
        </div>
        <Button
          title="register"
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          Sign In
        </Button>
      </form>
    );
}