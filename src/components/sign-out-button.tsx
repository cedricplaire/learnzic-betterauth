"use client"

import { toast } from "sonner";
import { signOut } from "@/lib/auth-client";
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react";
import { ArrowLeftToLine, ArrowRightFromLine } from "lucide-react";

export default function SignOutButton() {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();
    async function handleClick() {
        await signOut({
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true)
                },
                onResponse: () => {
                    setIsPending(false);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    toast.success("Sign Out success! See you soon ...")
                    router.push("/auth/login")
                }
            }
        })
    }

    return (
        <Button 
            size="sm"
            className="hover:cursor-pointer items-center pb-0.5"
            onClick={handleClick}
            variant="destructive"
            disabled={isPending}
        >
            Sign Out
            <ArrowRightFromLine />
        </Button>
    )

}