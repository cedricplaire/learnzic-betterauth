import React from "react";
import Link from "next/link";
import ReturnButton from "@/components/return-button";
import LoginForm from "@/components/login-form";
import { SignInOAuthButton } from "@/components/signin-oauth-button";
import MagicLinkLoginForm from "@/components/magic-link-login-form";

export default function page() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/" label="Home" />
        <h1 className="text-3-xl font-bold">Sign In</h1>
      </div>

      <div className="space-y-4">
        <MagicLinkLoginForm />
        <LoginForm />

        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="hover:text-foreground">
            Register
          </Link>
        </p>

        <hr className="max-w-sm" />
      </div>

      <div className="flex flex-col max-w-sm gap-4">
        <SignInOAuthButton provider="google" />
        <SignInOAuthButton provider="github" />
      </div>
    </div>
  );
}
