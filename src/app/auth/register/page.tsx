import React from "react";
import Link from "next/link";
import RegisterForm from "@/components/register-form";
import ReturnButton from "@/components/return-button";
import { SignInOAuthButton } from "@/components/signin-oauth-button";

export default function page() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-sceen-lg space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/" label="Home" />
        <h1 className="text-3-xl font-bold">Register</h1>
      </div>

      <div className="space-y-4">
        <RegisterForm />

        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="hover:text-foreground">
            Login
          </Link>
        </p>

        <hr className="max-w-sm" />
      </div>

      <div className="flex flex-col max-w-sm gap-4">
        <SignInOAuthButton signUp provider="google" />
        <SignInOAuthButton signUp provider="github" />
      </div>
    </div>
  );
}
