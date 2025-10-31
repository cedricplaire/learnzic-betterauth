"use server"

import { z } from "zod"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const PostFormSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  subject: z.string(),
  content: z.string(),
  published: z.boolean(),
});

export type State = {
  errors?: {
    userId?: string[];
    title?: string[];
    subject?: string[];
    content?: string[];
    published?: string[];
  };
  message?: string | null;
};

const CreateValidPost = PostFormSchema.omit({ id: true });
const UpdateValidPost = PostFormSchema.omit({ id: true });

export async function CreatePost(prevState: State, formData: FormData) {
  
  const validatedFields = CreateValidPost.safeParse({
    userId: formData.get("userId"),
    title: formData.get("title"),
    subject: formData.get("subject"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      //errors: treeifyError(validatedFields.error),
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Post.",
    };
  }
  // Prepare data for insertion into the database
  const {userId, title, subject, content } = validatedFields.data;

  try {
    await prisma.post.create({
      data: {
        subject: subject,
        title: title,
        content: content,
        userId: userId,
      },
    });
    console.log("tada ...");
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Create Post.",
    };
  }

  revalidatePath("/posts/create");
  redirect("/posts");

}

export async function UpdatePost(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateValidPost.safeParse({
    title: formData.get("title"),
    subject: formData.get("subject"),
    content: formData.get("content"),
    published: formData.get("published"),
  });

  if (!validatedFields.success) {
    return {
      //errors: treeifyError(validatedFields.error),
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Post.",
    };
  }
  // Prepare data for insertion into the database
  const { title, subject, content, published } = validatedFields.data;

  try {
    await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        subject: subject,
        title: title,
        content: content,
        published: published,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Update Post.",
    };
  }

  revalidatePath(`post/${id}/edit`);
  redirect("/posts");
}