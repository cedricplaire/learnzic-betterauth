"use client"

import { StarIcon } from 'lucide-react';
import { useRef, useState } from 'react'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { signIn } from '@/lib/auth-client';

export default function MagicLinkLoginForm() {
    const [isPending, setIsPending] = useState(false);
    const ref = useRef<HTMLDetailsElement>(null);
    async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        const formData = new FormData(evt.target as HTMLFormElement);
        const email = String(formData.get("email"));
        if (!email) {
            return toast.error("Please enter your email")
        }
        await signIn.magicLink({
            email,
            name: email.split("@")[0],
            callbackURL: "/profile",
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true)
                },
                onResponse: () => {
                    setIsPending(false);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message)
                },
                onSuccess: () => {
                    toast.success("Sign In email was sent successfully");
                    if (ref.current) ref.current.open = false;
                    (evt.target as HTMLFormElement).reset();
                }
            }
        })
    }

  return (
    <details
        ref={ref}
        className='max-w-sm rounded-md border border-purple-600 overflow-hidden'
    >
        <summary className="flex gap-2 items-center px-2 py-1 cursor-pointer bg-purple-600 text-white hover:bg-purple-600/80 transition">
            Try Magic Link
            <StarIcon size="18" />
        </summary>

        <form onSubmit={handleSubmit} className='px-2 py-1'>
            <Label htmlFor='email' className='sr-only'>
                EMail
            </Label>
            <div className="flex gap-2 items-center">
                <Input type='email' id='email' name='email' placeholder='email' />
                <Button type='submit' disabled={isPending}>Send</Button>
            </div>
        </form>
    </details>
  )
}
