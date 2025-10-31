import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import ReturnButton from "@/components/return-button";
import Link from "next/link";

export default async function Page() {
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
  const userPosts = await prisma.post.findMany({
    where: {
      userId: session.user.id,
    },
  });
  return (
    <div className="px-8 py-16 container mx-auto max-w-sceen-lg space-y-8">
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
              <td className="p-2">{post.id}</td>
              <td className="p-2">{post.createdAt.toLocaleDateString()}</td>
              <td className="p-2">{post.published ? "True" : "False"}</td>
              <td className="p-2">{post.title}</td>
              <td className="p-2">{post.subject}</td>
              <td className="p-2">{`${post.content.slice(0, 15)} ...`}</td>
              <td className="p-2">
                {
                  <Button size="sm" disabled={!FULL_POST_ACCESS.success}>
                    <Link href={`/posts/${post.id}/edit`}>Edit</Link>
                  </Button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
