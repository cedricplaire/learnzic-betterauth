import prisma from "@/lib/prisma";

export async function fetchPostById(id: string) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id
            }
        })
        return post;
    } catch (error) {
        console.error("Database Error :",  error);
        throw new Error(`Failed to fetch Post with ID : ${id}`)
    }
}
export async function fetchAllPosts() {
    try {
        const allPosts = await prisma.post.findMany();
        return allPosts;
    } catch (error) {
        console.error("Database Error :", error);
        throw new Error(`Failed to fetch All Posts`);
    }
}

export async function fetchPublishedPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: false,
      },
    });
    return posts;
  } catch (error) {
    console.error("Database Error :", error);
    throw new Error(`Failed to fetch published Post`);
  }
}