"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers"

export async function PublishPostButtonAction({postId}: {postId: string}) {
    const headersList = await headers();
    const session = await auth.api.getSession({
        headers: headersList
    });

    if (!session) throw new Error("Unauthorized");

    if (session.user.role !== "ADMIN") {
        throw new Error("FORBIDEN")
    }

    try {
        await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                published: true
            }
        });
        revalidatePath("/posts/admin")
        return {error: null}
    } catch (err) {
        if (isRedirectError(err)) {
            throw err
        };
        if (err instanceof Error) {
            return {error: err.message}
        };
        return {error: "Internal server error ..."}
    }
}