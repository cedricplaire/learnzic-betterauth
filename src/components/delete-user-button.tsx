"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TrashIcon } from 'lucide-react';
import { DeleteUserButtonAction } from '@/actions/delete-user.action';
import { toast } from 'sonner';

interface DeleteUserButtonProps {
    userId: string
}

export const DeleteUserButton = ({userId}: DeleteUserButtonProps) => {
    const [isPending, setIsPending] = useState(false);
    async function handleClick() {
        setIsPending(true)
        const { error } = await DeleteUserButtonAction({userId});
        if (error) {
            toast.error(error)
        } else {
            toast.success("User Deleted Successfully")
        }
        setIsPending(false);
    }

  return (
    <Button
        size="icon"
        variant={"destructive"}
        className='size-7 rounded-md'
        disabled={isPending}
        onClick={handleClick}
    >
        <span className="sr-only">
            Delete User
        </span>
        <TrashIcon />
    </Button>
  )
}

export const PlaceHolderDeleteUserButton = () => {
    return (
      <Button
        size="icon"
        variant={"destructive"}
        className="size-7 rounded-md"
        disabled
      >
        <span className="sr-only">Delete User</span>
        <TrashIcon />
      </Button>
    );
}
