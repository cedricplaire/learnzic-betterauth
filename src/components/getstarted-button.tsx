"use client"

import React from 'react'
import { useSession } from '@/lib/auth-client'
import { Button } from './ui/button';
import Link from 'next/link';

export const GetStartedButton = () => {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return (
            <Button size="lg" className='opacity-50' asChild>
                Get Started
            </Button>
        )
    }

    const href = session ? "/profile" : "/auth/login"

  return (
    <div className="flex flex-col gap-4 items-center">
      <Button size="lg" asChild className="">
        <Link href={href}>
          Get Started {session ? "-> Profile" : "-> Login"}
        </Link>
      </Button>
      {session && (
        <p className="flex items-center">
          <span
            data-role={session.user.role}
            className="size-6 mr-1 rounded-full animate-pulse data-[ROLE=USER]:bg-red-500 data-[ROLE=ADMIN]:bg-green-500"
          />
          Welcome back, {session.user.name}! ‧₊˚♪ 𝄞₊˚⊹
        </p>
      )}
    </div>
  );
}
