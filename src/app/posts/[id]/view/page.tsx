import {
  DeletePostButton,
  PlaceHolderDeletePostButton,
} from "@/components/delete-post-button";
import {
  EditPostButton,
  PlaceHolderEditPostButton,
} from "@/components/edit-post-button";
import { PublishPostButton } from "@/components/publish-post-button";
import ReturnButton from "@/components/return-button";
import SignOutButton from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { PostByIdWithName } from "@/data/posts.data";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const postId = params.id;
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) redirect("/auth/login");

  const FULL_POST_ACCESS = await auth.api.userHasPermission({
    headers: headersList,
    body: {
      permission: {
        posts: ["update", "delete"],
      },
    },
  });

  const post = await PostByIdWithName(postId);
  if (!post) {
    redirect("/posts");
  }

  return (
    <div className="px-8 py-16 container mx-auto max-w-sceen-lg space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/" label="Home" />
        <h1 className="text-3-xl font-bold">Profile</h1>

        <div className="flex items-center gap-2">
          {session.user.role === "ADMIN" && (
            <Button size="sm" asChild>
              <Link href={"/admin/dashboard"}>Admin Dashboard</Link>
            </Button>
          )}
          <SignOutButton />
        </div>
      </div>
      <div className="flex flex-col rounded-md w-full p-4 space-y-4 gap-2">
        <span className="grid grid-cols-3 justify-between">
          <p className="grid-cols-1 text-center">
            Creation date :{post?.createdAt.toLocaleDateString()}
          </p>
          <p className="grid-cols-1 text-center">
            Modifications :{post?.updatedAt.toLocaleDateString()}
          </p>
          <p className="grid-cols-1 text-center">
            Author : {post?.user?.name}{" "}
          </p>
        </span>
        <div className="grid grid-cols-3 justify-between">
          <span className="grid-cols-1 items-center justify-center text-center">
            {!post.published ? (
              <PublishPostButton postId={post.id} />
            ) : (
              "published"
            )}
          </span>
          <span className="grid-cols-1 text-center">
            {post.userId === session.user.id ? (
              <EditPostButton postId={post.id} />
            ) : (
              <PlaceHolderEditPostButton />
            )}
          </span>
          <span className="grid-cols-1 text-center">
            {post.userId === session.user.id || FULL_POST_ACCESS ? (
              <DeletePostButton postId={post.id} />
            ) : (
              <PlaceHolderDeletePostButton />
            )}
          </span>
        </div>
        <div className="items-center p-2 text-left bg-gray-100 text-gray-800">
          <span className="absolute w-24 h-12 -ml-20 rounded-l-full -mt-3 text-center  items-center justify-items-center pl-3 pt-2.5 border-2 border-gray-400 bg-gray-800 text-gray-100">
            TITRE
          </span>
          <span className="ml-6 flex flex-row indent-2">{post?.title}</span>
        </div>
        <div className="items-center p-2 text-left bg-gray-100 text-gray-800">
          <span className="absolute w-24 h-12 -ml-20 rounded-l-full -mt-3 text-center items-center justify-items-center pl-3 pt-2.5 border-2 border-gray-400 bg-gray-800 text-gray-100">
            SUBJECT
          </span>
          <span className="ml-6 flex flex-row indent-2">{post?.subject}</span>
        </div>
        <div className="items-center p-2 text-left bg-gray-100 text-gray-800">
          <span className="absolute w-24 h-12 -ml-20 rounded-l-full -mt-3 text-center items-center justify-items-center pl-3 pt-2.5 border-2 border-gray-400 bg-gray-800 text-gray-100">
            CONTENT
          </span>
          <span className="ml-6 flex flex-row indent-2">{post?.content}</span>
        </div>
      </div>
    </div>
  );
}
