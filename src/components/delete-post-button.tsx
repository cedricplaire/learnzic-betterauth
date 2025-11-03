"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TrashIcon } from 'lucide-react';
import { DeletePostButtonAction } from '@/actions/delete-post-action';
import { toast } from 'sonner';

interface DeletePostButtonProps {
    postId: string
}

export const DeletePostButton = ({postId}: DeletePostButtonProps) => {
    const [isPending, setIsPending] = useState(false);
    async function handleClick() {
        setIsPending(true)
        const { error } = await DeletePostButtonAction({postId});
        if (error) {
            toast.error(error)
        } else {
            toast.success("Post Deleted Successfully")
        }
        setIsPending(false);
    }

  return (
    <Button
        size="icon"
        variant={"destructive"}
        className='size-8 rounded-md hover:cursor-pointer hover:border-2 hover:border-gray-600'
        disabled={isPending}
        onClick={handleClick}
    >
        <span className="sr-only">
            Delete Post
        </span>
        <TrashIcon />
    </Button>
  )
}

export const PlaceHolderDeletePostButton = () => {
    return (
      <Button
        size="icon"
        variant={"destructive"}
        className="size-8 rounded-md hover:cursor-pointer hover:border-2 hover:border-gray-600"
        disabled
      >
        <span className="sr-only">Delete Post</span>
        <TrashIcon />
      </Button>
    );
}
