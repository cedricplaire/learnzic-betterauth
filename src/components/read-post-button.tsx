"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";

interface ReadPostButtonProps {
  postId: string;
}

export const ReadPostButton = ({ postId }: ReadPostButtonProps) => {

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant={"outline"}
          className="size-8 rounded-md border-2 border-gray-600"
        >
          <Link href={`/posts/${postId}/view`}>
            <EyeIcon />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Reading Post</TooltipContent>
    </Tooltip>
  );
};

export const PlaceHolderReadPostButton = () => {
  return (
    <Button
      size="icon"
      variant={"outline"}
      className="size-8 rounded-md border-2 border-gray-600"
      disabled
    >
      <span className="sr-only">Read Post</span>
      <EyeIcon />
    </Button>
  );
};
