import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import ReturnButton from "@/components/return-button";
import SignOutButton from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import {
  DeletePostButton,
  PlaceHolderDeletePostButton,
} from "@/components/delete-post-button";
import { PublishPostButton } from "@/components/publish-post-button";
import { EditPostButton, PlaceHolderEditPostButton } from "@/components/edit-post-button";
import Pagination from "@/components/pagination";
import { fetchPostPagination, fetchPostsPage } from "@/data/posts.data";
import Search from "@/components/search";

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
  if (session.user.role !== "ADMIN" || !FULL_POST_ACCESS) {
    return (
      <div className="px-6 py-12 mx-auto max-w-screen space-y-6">
        <h1 className="text-center">
          You dont have authorizations for this page.
        </h1>
        <p className="text-center text-red-600">
          Contact adminitrator or login with another account
        </p>
        <div className="flex flex-row justify-between">
          <Button size="sm">
            <Link href="/posts">Posts List</Link>
          </Button>
          <Button size="sm">
            <Link href="/auth/login">Chnage Account</Link>
          </Button>
        </div>
      </div>
    );
  }

  const postsWithNames = await fetchPostPagination(query, currentPage);
  const sortedPosts = postsWithNames.sort((a, b) =>
    a.createdAt >= b.createdAt ? -1 : 1
  );

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
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search Posts..." />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="table-auto min-w-full whitespace-nowrap md:table">
          <thead>
            <tr className="border-b text-sm text-left">
              <th scope="col" className="p-2">
                ID
              </th>
              <th scope="col" className="p-2">
                Author
              </th>
              <th scope="col" className="p-2">
                Published
              </th>
              <th scope="col" className="p-2">
                Title
              </th>
              <th scope="col" className="p-2">
                Subject
              </th>
              <th scope="col" className="p-2">
                Content
              </th>
              <th scope="col" className="p-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPosts.map((post) => (
              <tr
                key={post.id}
                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
              >
                <td className="whitespace-nowrap p-2">{`${post.id.slice(
                  0,
                  8
                )} ...`}</td>
                <td className="whitespace-nowrap p-2">{post.user.name}</td>
                <td className="whitespace-nowrap p-2">
                  {post.published ? "true" : "false"}
                </td>
                <td className="whitespace-nowrap p-2">{post.title}</td>
                <td className="whitespace-nowrap p-2">
                  {post.subject?.slice(0, 8)}
                </td>
                <td className="whitespace-nowrap p-2">
                  {post.content.slice(0, 40)}
                </td>
                <td className="whitespace-nowrap p-2 grid grid-cols-3 gap-0.5">
                  <span className="grid-cols-1">
                    {post.published === false && (
                      <PublishPostButton postId={post.id} />
                    )}
                  </span>
                  <span className="grid-cols-1">
                    {post.userId === session.user.id ? (
                      <EditPostButton postId={post.id} />
                    ) : (
                      <PlaceHolderEditPostButton />
                    )}
                  </span>
                  <span className="grid-cols-1">
                    {post.userId === session.user.id ? (
                      <DeletePostButton postId={post.id} />
                    ) : (
                      <PlaceHolderDeletePostButton />
                    )}
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
    </div>
  );
}
