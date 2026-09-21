import { useState, useRef, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { BlogPost } from "@/types/blog";
import { Field, inputStyle, cardStyle, ActionBtn, Toggle } from "../components/AdminUI";

interface Props {
  posts: BlogPost[];
  onChange: (posts: BlogPost[]) => void;
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function ToolbarBtn({ onClick, title, children }: { onClick: () => void; title: string; children: ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{ background: "none", border: "none", color: "#A3A3A3", cursor: "pointer", padding: "3px 7px", borderRadius: 5, fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.4 }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      {children}
    </button>
  );
}

function PostEditor({ post, onContent }: { post: BlogPost; onContent: (content: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const wrap = (before: string, after: string) => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e) || "text";
    onContent(value.slice(0, s) + before + selected + after + value.slice(e));
    requestAnimationFrame(() => { el.selectionStart = s + before.length; el.selectionEnd = s + before.length + selected.length; el.focus(); });
  };

  const prefix = (p: string) => {
    const el = ref.current;
    if (!el) return;
    const lineStart = el.value.lastIndexOf("\n", el.selectionStart - 1) + 1;
    onContent(el.value.slice(0, lineStart) + p + el.value.slice(lineStart));
    requestAnimationFrame(() => el.focus());
  };

  const insert = (text: string) => {
    const el = ref.current;
    if (!el) return;
    onContent(el.value.slice(0, el.selectionStart) + text + el.value.slice(el.selectionStart));
    requestAnimationFrame(() => el.focus());
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 1, padding: "4px 6px", background: "rgba(255,255,255,0.03)", borderRadius: "10px 10px 0 0", border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none" }}>
          <ToolbarBtn onClick={() => wrap("**", "**")} title="Bold">B</ToolbarBtn>
          <ToolbarBtn onClick={() => wrap("*", "*")} title="Italic"><em>I</em></ToolbarBtn>
          <div style={{ width: 1, background: "rgba(255,255,255,0.08)", margin: "4px 3px", alignSelf: "stretch" }} />
          <ToolbarBtn onClick={() => prefix("## ")} title="Heading 2">H2</ToolbarBtn>
          <ToolbarBtn onClick={() => prefix("### ")} title="Heading 3">H3</ToolbarBtn>
          <div style={{ width: 1, background: "rgba(255,255,255,0.08)", margin: "4px 3px", alignSelf: "stretch" }} />
          <ToolbarBtn onClick={() => wrap("`", "`")} title="Inline code">`code`</ToolbarBtn>
          <ToolbarBtn onClick={() => wrap("[", "](url)")} title="Link">link</ToolbarBtn>
          <ToolbarBtn onClick={() => insert("\n\n---\n\n")} title="Divider">---</ToolbarBtn>
        </div>
        <textarea
          ref={ref}
          style={{ ...inputStyle, minHeight: 340, resize: "vertical", borderRadius: "0 0 10px 10px", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.7 }}
          value={post.content}
          placeholder="Write your post content here…"
          onChange={(e) => onContent(e.target.value)}
        />
      </div>
      <div style={{ ...inputStyle, minHeight: 340, overflow: "auto", padding: "12px 16px", borderRadius: 10, fontSize: 14, lineHeight: 1.7, color: "#D4D4D4" }}>
        {post.content ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, marginTop: 20, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 6, color: "#F5F5F5" }}>{children}</h2>,
              h3: ({ children }) => <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, marginTop: 16, color: "#F5F5F5" }}>{children}</h3>,
              p: ({ children }) => <p style={{ marginBottom: 12, lineHeight: 1.75 }}>{children}</p>,
              strong: ({ children }) => <strong style={{ fontWeight: 700, color: "#F5F5F5" }}>{children}</strong>,
              a: ({ children, href }) => <a href={href} style={{ color: "#60a5fa", textDecoration: "underline" }}>{children}</a>,
              ul: ({ children }) => <ul style={{ paddingLeft: 18, marginBottom: 12 }}>{children}</ul>,
              ol: ({ children }) => <ol style={{ paddingLeft: 18, marginBottom: 12 }}>{children}</ol>,
              li: ({ children }) => <li style={{ marginBottom: 4 }}>{children}</li>,
              hr: () => <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "20px 0" }} />,
              blockquote: ({ children }) => <blockquote style={{ borderLeft: "3px solid rgba(255,255,255,0.2)", paddingLeft: 16, color: "#A3A3A3", fontStyle: "italic", marginBottom: 12 }}>{children}</blockquote>,
              pre: ({ children }) => <pre style={{ background: "rgba(255,255,255,0.05)", padding: "12px 16px", borderRadius: 8, overflow: "auto", marginBottom: 12 }}>{children}</pre>,
              code: ({ children }) => <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#A3A3A3" }}>{children}</code>,
            }}
          >
            {post.content}
          </ReactMarkdown>
        ) : (
          <span style={{ color: "#525252", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
            Preview will appear here as you type…
          </span>
        )}
      </div>
    </div>
  );
}

export function BlogEditor({ posts, onChange }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const setItem = (idx: number, partial: Partial<BlogPost>) =>
    onChange(posts.map((p, i) => (i === idx ? { ...p, ...partial } : p)));

  const remove = (idx: number) =>
    onChange(posts.filter((_, i) => i !== idx));

  const requestDelete = (origIdx: number) => {
    if (pendingDelete === origIdx) {
      clearTimeout(deleteTimerRef.current);
      setPendingDelete(null);
      remove(origIdx);
      return;
    }
    clearTimeout(deleteTimerRef.current);
    setPendingDelete(origIdx);
    deleteTimerRef.current = setTimeout(() => setPendingDelete(null), 3000);
  };

  const add = () => {
    const order = posts.length;
    onChange([...posts, { slug: "", title: "", excerpt: "", tag: "", date: new Date().toISOString().split("T")[0] ?? "", readTime: "5 min", content: "", published: false, order }]);
    setExpanded((prev) => new Set([...prev, posts.length]));
  };

  const toggleExpand = (origIdx: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(origIdx)) next.delete(origIdx); else next.add(origIdx);
      return next;
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Blog Posts</h2>
        <ActionBtn onClick={add}>+ New Post</ActionBtn>
      </div>
      <p style={{ fontSize: 12, color: "#525252", marginBottom: 20 }}>
        Write in Markdown — the preview on the right matches the live blog.
      </p>

      {posts.length === 0 && (
        <div style={{ color: "#525252", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", padding: "32px 0" }}>
          No posts yet — click "+ New Post" to get started.
        </div>
      )}

      {sorted.map((post, i) => {
        const origIdx = posts.indexOf(post);
        const isExpanded = expanded.has(origIdx);
        const isPending = pendingDelete === origIdx;
        return (
          <div key={i} style={cardStyle}>
            <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => toggleExpand(origIdx)}>
              <div className="flex items-center gap-3" style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#525252", flexShrink: 0 }}>#{i + 1}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: post.title ? "#F5F5F5" : "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {post.title || "Untitled Post"}
                </span>
                {post.tag && (
                  <span style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "1px 8px", fontSize: 11, color: "#A3A3A3", flexShrink: 0 }}>
                    {post.tag}
                  </span>
                )}
                {post.date && (
                  <span style={{ fontSize: 11, color: "#525252", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{post.date}</span>
                )}
              </div>
              <div className="flex items-center gap-2 ml-3" onClick={(e) => e.stopPropagation()}>
                <Toggle checked={post.published} onChange={(v) => setItem(origIdx, { published: v })} label={post.published ? "Live" : "Draft"} />
                <button
                  type="button"
                  onClick={() => requestDelete(origIdx)}
                  style={{ background: isPending ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${isPending ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 8, padding: "4px 12px", color: isPending ? "#ef4444" : "#A3A3A3", fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all .15s" }}
                >
                  {isPending ? "Sure?" : "Delete"}
                </button>
                <span style={{ color: "#525252", fontSize: 11 }}>{isExpanded ? "▲" : "▼"}</span>
              </div>
            </div>

            {isExpanded && (
              <div style={{ marginTop: 20 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Title">
                    <input
                      style={inputStyle}
                      value={post.title}
                      placeholder="Post title"
                      onChange={(e) => { const title = e.target.value; setItem(origIdx, { title, slug: slugify(title) || post.slug }); }}
                    />
                  </Field>
                  <Field label="Tag">
                    <input style={inputStyle} value={post.tag} placeholder="e.g. Design, Engineering" onChange={(e) => setItem(origIdx, { tag: e.target.value })} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Date">
                    <input type="date" style={inputStyle} value={post.date} onChange={(e) => setItem(origIdx, { date: e.target.value })} />
                  </Field>
                  <Field label="Read Time">
                    <input style={inputStyle} value={post.readTime} placeholder="5 min" onChange={(e) => setItem(origIdx, { readTime: e.target.value })} />
                  </Field>
                  <Field label="Slug (auto)">
                    <div style={{ ...inputStyle, color: "#525252", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", cursor: "default" }}>
                      {post.slug || "—"}
                    </div>
                  </Field>
                </div>
                <Field label="Excerpt">
                  <textarea style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} value={post.excerpt} placeholder="A short summary shown in the blog list" onChange={(e) => setItem(origIdx, { excerpt: e.target.value })} />
                </Field>
                <Field label="Content">
                  <PostEditor post={post} onContent={(content) => setItem(origIdx, { content })} />
                </Field>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
