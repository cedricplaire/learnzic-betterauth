"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PenBoxIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";

interface EditPostButtonProps {
  postId: string;
}

export const EditPostButton = ({ postId }: EditPostButtonProps) => {

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant={"outline"}
          className="size-8 rounded-md border-2 border-gray-600"
        >
          <Link href={`/posts/${postId}/edit`}>
            <PenBoxIcon />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Edit Post (Owner or Admin)</TooltipContent>
    </Tooltip>
  );
};

export const PlaceHolderEditPostButton = () => {
  return (
    <Button
      size="icon"
      variant={"outline"}
      className="size-8 rounded-md border-2 border-gray-600"
      disabled
    >
      <span className="sr-only">Edit Post</span>
      <PenBoxIcon />
    </Button>
  );
};
