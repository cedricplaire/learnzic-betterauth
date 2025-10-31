"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import { State, UpdatePost } from "@/actions/create-post-action";
import { Textarea } from "@/components/ui/textarea";
import { Prisma } from "@/generated/prisma/client";

export default function UpdatePostForm({ post }: { post: Prisma.PostModel }) {
  const [title1, setTitle1] = useState(post.title);
  const [subject1, setSubject1] = useState(post.subject);
  const [content1, setContent1] = useState(post.content);
  const [publish, setPublish] = useState(post.published);

  const  handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    if (evt.target.name === "title") {
      setTitle1(value);
    } else {
      setSubject1(value);
    }
  }
  const handleContent = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent1(evt.target.value);
  };
  const handlePublish = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setPublish(evt.target.checked);
  };
  const initialState: State = { message: null, errors: {} };
  const updatePostWithId = UpdatePost.bind(null, post.id);
  const [state, formAction] = useActionState(
    updatePostWithId,
    initialState
  );

  return (
    <form action={formAction} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          name="title"
          id="title"
          onChange={handleChange}
          value={title1}
        />
      </div>
      {state.errors?.title && <p>Erreur on Title</p>}

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          name="subject"
          id="subject"
          value={subject1 || ""}
          onChange={handleChange}
          //defaultValue={post.subject as string}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          rows={12}
          id="content"
          name="content"
          value={content1}
          onChange={handleContent}
        />
      </div>
      <div className="flex items-center space-x-2 space-y-2">
        <Input
          type="checkbox"
          name="published"
          id="published"
          checked={publish}
          onChange={handlePublish}
        />
        <Label htmlFor="published">Published ?</Label>
      </div>

      <Button
        title="update-post"
        type="submit"
        className="flex items-center space-x-2 space-y-2 w-full"
        //disabled={isPending}
      >
        Update Post
      </Button>
    </form>
  );
}
