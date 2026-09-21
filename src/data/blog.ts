import type { BlogPost } from "@/types/blog";

const modules = import.meta.glob<{ default: BlogPost }>("./blog/*.json");
let cachedBlogPosts: BlogPost[] | null = null;

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (cachedBlogPosts) return cachedBlogPosts;

  const posts = await Promise.all(
    Object.values(modules).map(async (loadModule) => {
      const mod = await loadModule();
      return mod.default;
    })
  );

  cachedBlogPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return cachedBlogPosts;
}
