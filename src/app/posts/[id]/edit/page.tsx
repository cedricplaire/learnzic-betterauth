import UpdatePostForm from "@/components/edit-post-form";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import ReturnButton from "@/components/return-button";
import Link from "next/link";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });
  if (!post) {
    notFound();
  }
  return (
    <div className="px-8 py-16 container mx-auto max-w-sceen-lg space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/posts" label="posts" />
        <h1 className="text-3-xl font-bold">Edit Post</h1>
        <p className="p-2 rounded-md text-lg bg-green-600 text-white font-bold">
          Access Granted
        </p>
        <Button title="create-post" type="submit" className="w-full px-3 py-2">
          <Link href={"/posts/create"}>Create New Post</Link>
        </Button>
      </div>
      <div className="px-2 py-4 mx-auto space-y-6">
        <UpdatePostForm post={post} />
      </div>
    </div>
  );
}
