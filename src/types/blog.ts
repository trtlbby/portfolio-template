export interface BlogPost {
  slug: string;       // used as filename (e.g. "my-post.json")
  title: string;
  excerpt: string;
  tag: string;
  date: string;       // ISO: "2026-04-22"
  readTime: string;   // "5 min"
  content: string;    // post body
  published: boolean;
  order: number;
}
