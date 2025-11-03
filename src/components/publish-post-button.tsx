"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SendIcon } from 'lucide-react';
import { PublishPostButtonAction } from '@/actions/publish-post-action';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface PublishPostButtonProps {
    postId: string
}

export const PublishPostButton = ({postId}: PublishPostButtonProps) => {
    const [isPending, setIsPending] = useState(false);
    async function handleClick() {
        setIsPending(true)
        const { error } = await PublishPostButtonAction({postId});
        if (error) {
            toast.error(error)
        } else {
            toast.success("Post Publishd Successfully")
        }
        setIsPending(false);
    }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant={"outline"}
          className="size-8 rounded-md border-2 border-gray-600"
          disabled={isPending}
          onClick={handleClick}
        >
          <span className="sr-only">Publish Post</span>
          <SendIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Publish Post to public
      </TooltipContent>
    </Tooltip>
  );
}

export const PlaceHolderPublishPostButton = () => {
    return (
      <Button
        size="icon"
        variant={"destructive"}
        className="size-7 rounded-md"
        disabled
      >
        <span className="sr-only">Publish Post</span>
        <SendIcon />
      </Button>
    );
}
