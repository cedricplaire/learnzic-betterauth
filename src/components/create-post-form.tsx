'use client'

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { createPost, State } from "@/actions/create-post-action";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "./ui/switch";

export default function CreatePostForm({ userId }: {userId: string}) {

  const initialState: State = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(createPost, initialState);
  /* async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsPending(true);

    const formData = new FormData(evt.target as HTMLFormElement);
    const { error } = await createNewPost(formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success("post created successfully");
      (evt.target as HTMLFormElement).reset();
    }

    setIsPending(false);
    
    redirect("/posts");
  } */

  return (
    <form action={formAction} className="max-w-sm w-full space-y-4">
      <Input type="hidden" name="userId" id="userId" value={userId} />
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input name="title" id="title" defaultValue={""} />
      </div>
      {state.errors?.title && <p>{state.errors?.title}</p>}

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input name="subject" id="subject" defaultValue={""} />
      </div>
      {state.errors?.subject && <p>{state.errors?.subject}</p>}
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          rows={8}
          id="content"
          name="content"
          defaultValue={"Contenu de votre article"}
        />
      </div>
      {state.errors?.content && <p>{state.errors?.content}</p>}

      <div className="flex flex-col p-4 bg-gray-200 space-x-2 space-y-2">
        <div className="flex flex-row p-2 gap-2">
          <Switch
            name="published"
            id="published"
            defaultValue={"off"}
            className="data-[state=checked]:border-green-800 data-[state=checked]:bg-green-600 data-[state=unchecked]:border-gray-800 data-[state=unchecked]:bg-gray-400"
          />
          <Label
            htmlFor="published"
            className="data-[state=checked]:text-green-800 text-gray-800"
          >
            Published ?
          </Label>
        </div>
        <span className="text-sm text-gray-500">
          Uncheck to create a draft and modify later.
        </span>
      </div>
      {state.errors?.published && <p>{state.errors?.published}</p>}

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
