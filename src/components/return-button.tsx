import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'

interface ReturnButtonProps {
    href: string,
    label: string
}

export default function ReturnButton({href, label}: ReturnButtonProps) {
  return (
    <Button size="sm" asChild>
        <Link href={href}>
            <ArrowLeftIcon />{label}
        </Link>
    </Button>
  )
}
