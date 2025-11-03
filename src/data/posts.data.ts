import prisma from "@/lib/prisma";

const ITEMS_PER_PAGE = 6;

export async function fetchPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });
    return post;
  } catch (error) {
    console.error("Database Error :", error);
    throw new Error(`Failed to fetch Post with ID : ${id}`);
  }
}

export async function PostByIdWithName(id: string) {
  try {
    const post = await prisma.post.findUnique({
      relationLoadStrategy: "join", // or "query"
      where: {
        id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    return post;
  } catch (error) {
    console.error("Database Error :", error);
    throw new Error(`Failed to fetch Post with ID : ${id}`);
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
export async function fetchAllMyPosts(userId: string) {
  try {
    const MyPosts = await prisma.post.findMany({
      relationLoadStrategy: "join",
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
    });
    return MyPosts;
  } catch (error) {
    console.error("Database error :", error); // Todo: check Error Type and send appropriate message
    throw new Error("Failed to load posts for current user");
  }
}
export async function fetchAllPostWithAuthor() {
  try {
    const posts = await prisma.post.findMany({
      relationLoadStrategy: "join", // or "query"
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.error("database error :", error);
    throw new Error("Failed to fetch Post with Author name");
  }
}
export async function fetchPublishedPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
    });
    return posts;
  } catch (error) {
    console.error("Database Error :", error);
    throw new Error(`Failed to fetch published Post`);
  }
}

export async function fetchPostsPage(query: string) {
  try {
    const pagesData = await prisma.post.count({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            subject: {
              contains: query,
            },
          },
        ],
      },
    });
    const numberPages = Math.ceil(Number(pagesData) / ITEMS_PER_PAGE);
    console.log(numberPages);
    return numberPages;
  } catch (error) {
    console.error("Database Error :", error);
    throw new Error(`Failed to fetch Posts Pages Number for pagination`);
  }
}

export async function fetchPostPagination(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const paginated = await prisma.post.findMany({
      relationLoadStrategy: "join", // or "query"
      include: {
        user: {
          select: {
            role: true,
            name: true,
          },
        },
      },
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            subject: {
              contains: query,
            },
          },
        ],
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });
    return paginated;
  } catch (error) {
    console.error("Database Error :", error);
    throw new Error(`Failed to fetch filtered Posts for pagination`);
  }
}
