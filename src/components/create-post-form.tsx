'use client'

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { CreatePost, State } from "@/actions/create-post-action";
import { Textarea } from "@/components/ui/textarea";

export default function CreatePostForm({ userId }: {userId: string}) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(CreatePost, initialState);

  return (
    <form action={formAction} className="max-w-sm w-full space-y-4">
      <Input type="hidden" name="userId" id="userId" value={userId} />
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input name="title" id="title" />
        {state.errors?.title && <p>Erreur on title</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input name="subject" id="subject" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          rows={8}
          id="content"
          name="content"
        />
      </div>

      <Button
        title="create-post"
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        Create Post
      </Button>
    </form>
  );
}
