import CreatePostForm from "@/components/create-post-form";
import ReturnButton from "@/components/return-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) throw new Error("Unauthorized");

  const authorId = session.session.userId;
  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/posts" label="Posts List" />
        <h1 className="text-3-xl font-bold">Create New Post</h1>
      </div>
      <div className="px-2 py-4 mx-auto space-y-6">
        <CreatePostForm userId={authorId} />
      </div>
    </div>
  );
}
