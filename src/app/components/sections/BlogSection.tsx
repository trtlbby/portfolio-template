import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PillBadge } from "../PillBadge";
import { getBlogPosts } from "@/data/blog";
import type { BlogPost } from "@/types/blog";

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, m! - 1, d!).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogSection({ limit }: { limit?: number }) {
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
  const visiblePosts = limit ? published.slice(0, limit) : published;

  return (
    <section>
      {/* Heading block */}
      <div className="mb-8">
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "var(--pf-fg-4)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: 8,
          }}
        >
          Blog
        </p>
        <div className="flex items-center justify-between gap-4">
          <p
            style={{
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: 700,
              color: "var(--pf-fg)",
              fontFamily: "'Satoshi', sans-serif",
              lineHeight: 1.2,
            }}
          >
            Things I've Written
          </p>
          {limit && published.length > 0 && (
            <button
              onClick={() => navigate("/blog")}
              style={{
                background: "transparent",
                border: "1px solid var(--pf-border-strong)",
                borderRadius: 999,
                padding: "5px 14px",
                color: "var(--pf-fg-4)",
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--pf-fg)";
                e.currentTarget.style.borderColor = "var(--pf-border-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--pf-fg-4)";
                e.currentTarget.style.borderColor = "var(--pf-border-strong)";
              }}
            >
              view all →
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div
          style={{
            background: "var(--pf-surface)",
            border: "1px solid var(--pf-border)",
            borderRadius: 16,
            padding: "24px",
            textAlign: "center",
            color: "var(--pf-fg-4)",
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          loading posts...
        </div>
      ) : published.length === 0 ? (
        /* Empty state */
        <div
          style={{
            background: "var(--pf-surface)",
            border: "1px solid var(--pf-border)",
            borderRadius: 16,
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: "var(--pf-fg-4)",
              marginBottom: 8,
            }}
          >
            // coming soon
          </p>
          <p style={{ fontSize: 14, color: "var(--pf-fg-3)", lineHeight: 1.6 }}>
            Posts are on their way. Check back later.
          </p>
        </div>
      ) : (
        /* Posts list */
        <div
          style={{
            background: "var(--pf-surface)",
            border: "1px solid var(--pf-border)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {visiblePosts.map((post, i) => (
            <div
              key={post.slug}
              className="group cursor-pointer"
              onClick={() => navigate(`/blog/${post.slug}`)}
              style={{
                borderTop: i === 0 ? "none" : "1px solid var(--pf-divider)",
                padding: "20px 24px",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--pf-surface-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Tag + meta row */}
                  <div className="flex items-center gap-3 mb-2">
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

                  {/* Title */}
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--pf-fg)",
                      fontFamily: "'Satoshi', sans-serif",
                      marginBottom: 6,
                      lineHeight: 1.4,
                    }}
                    className="group-hover:underline"
                  >
                    {post.title}
                  </p>

                  {/* Excerpt */}
                  <p style={{ fontSize: 13, color: "var(--pf-fg-3)", lineHeight: 1.6 }}>
                    {post.excerpt}
                  </p>
                </div>

                <div
                  style={{ color: "var(--pf-fg-4)", flexShrink: 0, paddingTop: 4 }}
                  className="group-hover:text-[var(--pf-fg)] transition-colors"
                >
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
