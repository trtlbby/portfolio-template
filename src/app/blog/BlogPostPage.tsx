import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { getBlogPosts } from "@/data/blog";
import { PillBadge } from "@/app/components/PillBadge";
import { DEFAULT_TITLE } from "@/lib/siteMeta";
import type { BlogPost } from "@/types/blog";

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, m! - 1, d!).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getBlogPosts()
      .then((loadedPosts) => {
        if (mounted) setPosts(loadedPosts);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const published = posts.filter((p) => p.published);
  const post = published.find((p) => p.slug === slug);
  const currentIndex = post ? published.findIndex((p) => p.slug === post.slug) : -1;
  const prevPost = currentIndex < published.length - 1 ? published[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? published[currentIndex - 1] : null;

  useEffect(() => {
    if (post) document.title = `${post.title} — Your Blog`;
    return () => { document.title = DEFAULT_TITLE; };
  }, [post]);

  if (loading) {
    return (
      <div
        style={{
          background: "var(--pf-bg)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--pf-fg-4)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
        }}
      >
        loading post...
      </div>
    );
  }

  if (!post) {
    return (
      <div
        style={{
          background: "var(--pf-bg)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "var(--pf-fg-4)",
          }}
        >
          // 404
        </p>
        <p style={{ color: "var(--pf-fg-3)", fontSize: 15 }}>Post not found.</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--pf-fg-3)",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "'Satoshi', sans-serif",
            textDecoration: "underline",
            textUnderlineOffset: 4,
          }}
        >
          Go back home
        </button>
      </div>
    );
  }

  return (
    <div
      className="no-scrollbar"
      style={{
        background: "var(--pf-bg)",
        color: "var(--pf-fg)",
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "48px 24px 96px",
        }}
      >
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 cursor-pointer"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--pf-fg-4)",
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 48,
            padding: 0,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pf-fg-link)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pf-fg-4)")}
        >
          <ArrowLeft size={13} />
          back
        </button>

        {/* Post header */}
        <div style={{ marginBottom: 40 }}>
          <div className="flex items-center gap-3 mb-4">
            <PillBadge>{post.tag}</PillBadge>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "var(--pf-fg-4)",
              }}
            >
              {formatDate(post.date)} · {post.readTime} read
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 700,
              color: "var(--pf-fg)",
              fontFamily: "'Satoshi', sans-serif",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            {post.title}
          </h1>

          <p
            style={{
              fontSize: 16,
              color: "var(--pf-fg-3)",
              lineHeight: 1.7,
              maxWidth: 600,
            }}
          >
            {post.excerpt}
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "var(--pf-post-divider)",
            marginBottom: 40,
          }}
        />

        {/* Content */}
        <div className="prose-blog">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Prev / Next */}
        {(prevPost || nextPost) && (
          <>
            <div style={{ height: 1, background: "var(--pf-post-divider)", margin: "48px 0 32px" }} />
            <div className="flex items-start justify-between gap-4">
              {prevPost ? (
                <button
                  onClick={() => navigate(`/blog/${prevPost.slug}`)}
                  className="flex flex-col items-start gap-1 cursor-pointer"
                  style={{ background: "transparent", border: "none", padding: 0, textAlign: "left", maxWidth: "45%" }}
                  onMouseEnter={(e) => (e.currentTarget.querySelector("span:last-child") as HTMLElement | null)?.style.setProperty("text-decoration", "underline")}
                  onMouseLeave={(e) => (e.currentTarget.querySelector("span:last-child") as HTMLElement | null)?.style.setProperty("text-decoration", "none")}
                >
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--pf-fg-4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    ← older
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--pf-fg)", fontFamily: "'Satoshi', sans-serif", lineHeight: 1.4 }}>
                    {prevPost.title}
                  </span>
                </button>
              ) : <div />}

              {nextPost ? (
                <button
                  onClick={() => navigate(`/blog/${nextPost.slug}`)}
                  className="flex flex-col items-end gap-1 cursor-pointer"
                  style={{ background: "transparent", border: "none", padding: 0, textAlign: "right", maxWidth: "45%" }}
                  onMouseEnter={(e) => (e.currentTarget.querySelector("span:last-child") as HTMLElement | null)?.style.setProperty("text-decoration", "underline")}
                  onMouseLeave={(e) => (e.currentTarget.querySelector("span:last-child") as HTMLElement | null)?.style.setProperty("text-decoration", "none")}
                >
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--pf-fg-4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    newer →
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--pf-fg)", fontFamily: "'Satoshi', sans-serif", lineHeight: 1.4 }}>
                    {nextPost.title}
                  </span>
                </button>
              ) : <div />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
