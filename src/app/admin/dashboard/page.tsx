import React from "react";
import ReturnButton from "@/components/return-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  DeleteUserButton,
  PlaceHolderDeleteUserButton,
} from "@/components/delete-user-button";
import { UserRoleSelect } from "@/components/user-role-select";
import { UserRole } from "@/generated/prisma/enums";

export default async function page() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/auth/login");

  if (session.user.role !== "ADMIN") {
    return (
      <div className="px-8 py-16 container mx-auto max-w-sceen-lg space-y-8">
        <div className="space-y-4">
          <ReturnButton href="/profile" label="Profile" />
          <h1 className="text-3-xl font-bold">Sign In</h1>
          <p className="p-2 rounded-md text-lg bg-red-600 text-white font-bold">
            FORBIDEN
          </p>
        </div>
      </div>
    );
  }

  const { users } = await auth.api.listUsers({
    headers: headersList,
    query: {
      sortBy: "name",
    },
  });

  const sortedUsers = users.sort((a, b) => {
    if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
    if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;
    return 0;
  });

  return (
    <div className="px-8 py-16 container mx-auto max-w-sceen-lg space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/profile" label="Profile" />
        <h1 className="text-3-xl font-bold">Sign In</h1>
        <p className="p-2 rounded-md text-lg bg-green-600 text-white font-bold">
          Access Granted
        </p>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="table-auto min-w-full whitespace-nowrap">
          <thead>
            <tr className="border-b text-sm text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Verified</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id} className="border-b text-sm text-left">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <UserRoleSelect
                    userId={user.id}
                    role={user.role as UserRole}
                  />
                </td>
                <td className="p-2">{user.emailVerified ? "true" : "false"}</td>
                <td className="p-2">
                  {user.role === "USER" ? (
                    <DeleteUserButton userId={user.id} />
                  ) : (
                    <PlaceHolderDeleteUserButton />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
