import { useState } from "react";
import type { BlogPost } from "@/types/blog";
import { Field, inputStyle, cardStyle, ActionBtn, Toggle } from "../components/AdminUI";

interface Props {
  posts: BlogPost[];
  onChange: (posts: BlogPost[]) => void;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function BlogEditor({ posts, onChange }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const setItem = (idx: number, partial: Partial<BlogPost>) => {
    onChange(posts.map((p, i) => (i === idx ? { ...p, ...partial } : p)));
  };

  const remove = (idx: number) => {
    onChange(posts.filter((_, i) => i !== idx));
  };

  const add = () => {
    const order = posts.length;
    onChange([
      ...posts,
      {
        slug: "",
        title: "",
        excerpt: "",
        tag: "",
        date: new Date().toISOString().split("T")[0] ?? "",
        readTime: "5 min",
        content: "",
        published: false,
        order,
      },
    ]);
    // Auto-expand the new card
    setExpanded((prev) => new Set([...prev, posts.length]));
  };

  const toggleExpand = (origIdx: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(origIdx)) next.delete(origIdx);
      else next.add(origIdx);
      return next;
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Blog Posts</h2>
        <ActionBtn onClick={add}>+ New Post</ActionBtn>
      </div>

      {sorted.length === 0 && (
        <div
          style={{
            color: "#525252",
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            padding: "32px 0",
          }}
        >
          No posts yet — click "+ New Post" to get started.
        </div>
      )}

      {sorted.map((post, i) => {
        const origIdx = posts.indexOf(post);
        const isExpanded = expanded.has(origIdx);

        return (
          <div key={i} style={cardStyle}>
            {/* Collapsed header row */}
            <div
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleExpand(origIdx)}
            >
              <div
                className="flex items-center gap-3"
                style={{ flex: 1, minWidth: 0 }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: "#525252",
                    flexShrink: 0,
                  }}
                >
                  #{i + 1}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: post.title ? "#F5F5F5" : "#525252",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {post.title || "Untitled Post"}
                </span>
                {post.tag && (
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: "#475569",
                      flexShrink: 0,
                    }}
                  >
                    {post.tag}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#334155",
                    flexShrink: 0,
                  }}
                >
                  {post.date}
                </span>
              </div>

              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Toggle
                  checked={post.published}
                  onChange={(v) => setItem(origIdx, { published: v })}
                  label={post.published ? "Live" : "Draft"}
                />
                <ActionBtn danger onClick={() => remove(origIdx)}>
                  Delete
                </ActionBtn>
                <span style={{ color: "#525252", fontSize: 11, marginLeft: 4 }}>
                  {isExpanded ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {/* Expanded edit form */}
            {isExpanded && (
              <div style={{ marginTop: 20 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Title">
                    <input
                      style={inputStyle}
                      value={post.title}
                      placeholder="Post title"
                      onChange={(e) => {
                        const title = e.target.value;
                        // Always sync slug from title
                        setItem(origIdx, {
                          title,
                          slug: slugify(title) || post.slug,
                        });
                      }}
                    />
                  </Field>
                  <Field label="Tag">
                    <input
                      style={inputStyle}
                      value={post.tag}
                      placeholder="e.g. Design, Engineering, Research"
                      onChange={(e) => setItem(origIdx, { tag: e.target.value })}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Date">
                    <input
                      type="date"
                      style={inputStyle}
                      value={post.date}
                      onChange={(e) => setItem(origIdx, { date: e.target.value })}
                    />
                  </Field>
                  <Field label="Read Time">
                    <input
                      style={inputStyle}
                      value={post.readTime}
                      placeholder="5 min"
                      onChange={(e) => setItem(origIdx, { readTime: e.target.value })}
                    />
                  </Field>
                  <Field label="Slug (auto)">
                    <div
                      style={{
                        ...inputStyle,
                        color: "#525252",
                        fontSize: 12,
                        fontFamily: "'JetBrains Mono', monospace",
                        cursor: "default",
                      }}
                    >
                      {post.slug || "—"}
                    </div>
                  </Field>
                </div>

                <Field label="Excerpt">
                  <textarea
                    style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
                    value={post.excerpt}
                    placeholder="A short summary shown in the blog list"
                    onChange={(e) => setItem(origIdx, { excerpt: e.target.value })}
                  />
                </Field>

                <Field label="Content">
                  <textarea
                    style={{
                      ...inputStyle,
                      minHeight: 240,
                      resize: "vertical",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      lineHeight: 1.7,
                    }}
                    value={post.content}
                    placeholder="Write your post content here…"
                    onChange={(e) => setItem(origIdx, { content: e.target.value })}
                  />
                </Field>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
