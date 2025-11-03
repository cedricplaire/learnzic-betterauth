import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import ReturnButton from "@/components/return-button";
import Link from "next/link";
import { fetchPostPagination, fetchPostsPage } from "@/data/posts.data";
import Pagination from "@/components/pagination";
import { EditPostButton, PlaceHolderEditPostButton } from "@/components/edit-post-button";
import { ReadPostButton } from "@/components/read-post-button";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchPostsPage(query);
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
  const userPosts = await fetchPostPagination(query, currentPage);
  if (!userPosts) {
    redirect("/");
  }

  return (
    <div className="px-6 py-12 max-w-sceen-lg space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/profile" label="Profile" />
        <h1 className="text-3-xl font-bold">All Your Posts</h1>
        <p className="p-2 rounded-md text-lg bg-green-600 text-white font-bold">
          Access Granted
        </p>
        <Button title="create-post" type="submit" className="w-full px-3 py-2">
          <Link href={"/posts/create"}>Create Post</Link>
        </Button>
      </div>
      <table className="table-auto min-w-full whitespace-nowrap">
        <thead>
          <tr className="border-b text-sm text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Date Create</th>
            <th className="p-2">Published</th>
            <th className="p-2">Title</th>
            <th className="p-2">Subject</th>
            <th className="p-2">Content</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userPosts.map((post) => (
            <tr key={post.id} className="border-b text-sm text-left">
              <td className="p-2">{`${post.id.slice(0, 6)} ...`}</td>
              <td className="p-2">{post.createdAt.toLocaleDateString()}</td>
              <td className="p-2">{post.published ? "True" : "False"}</td>
              <td className="p-2">{post.title}</td>
              <td className="p-2">{`${post.subject?.slice(0, 25)} ...`}</td>
              <td className="p-2">{`${post.content.slice(0, 60)} ...`}</td>

              <td className="p-2 grid grid-cols-2">
                <span className="p-2 grid-cols-1">
                  <ReadPostButton postId={post.id} />
                </span>
                <span className="grid-cols-1 p-2">
                {FULL_POST_ACCESS ? <EditPostButton postId={post.id} /> :
                  <PlaceHolderEditPostButton />
                }
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
