import { useState, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { Project } from "@/types/portfolio";
import { Field, inputStyle, cardStyle, Toggle, ActionBtn, ItemListEditor } from "../components/AdminUI";

interface Props {
  projects: Project[];
  onChange: (p: Project[]) => void;
}

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function ProjectEditor({ projects, onChange }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sorted = [...projects].sort((a, b) => a.order - b.order);

  const setItem = (idx: number, partial: Partial<Project>) =>
    onChange(projects.map((p, i) => (i === idx ? { ...p, ...partial } : p)));

  const remove = (idx: number) =>
    onChange(projects.filter((_, i) => i !== idx));

  const add = () => {
    const newIdx = projects.length;
    onChange([...projects, { title: "", subtitle: "", role: "", period: "", description: "", tags: [], bullets: [""], imageUrl: "", link: "", destinationType: "detail", slug: "", embedVideoUrl: "", videoFileUrl: "", isFeatured: false, isVisible: true, order: newIdx }]);
    setExpanded((prev) => new Set([...prev, newIdx]));
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...sorted];
    [next[i - 1]!.order, next[i]!.order] = [next[i]!.order, next[i - 1]!.order];
    onChange(next);
  };

  const moveDown = (i: number) => {
    if (i >= sorted.length - 1) return;
    const next = [...sorted];
    [next[i]!.order, next[i + 1]!.order] = [next[i + 1]!.order, next[i]!.order];
    onChange(next);
  };

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

  const toggleExpand = (origIdx: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(origIdx)) next.delete(origIdx); else next.add(origIdx);
      return next;
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Projects</h2>
        <ActionBtn onClick={add}>+ Add</ActionBtn>
      </div>
      <p style={{ fontSize: 12, color: "#525252", marginBottom: 20 }}>Portfolio projects shown on the Projects section and detail pages.</p>

      {projects.length === 0 && (
        <div style={{ ...cardStyle, textAlign: "center", padding: 32, color: "#525252", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
          No projects yet — click "+ Add" to get started.
        </div>
      )}

      {sorted.map((proj, i) => {
        const origIdx = projects.indexOf(proj);
        const isExpanded = expanded.has(origIdx);
        const isPending = pendingDelete === origIdx;
        const destinationType = proj.destinationType ?? "external";
        return (
          <div key={i} style={cardStyle}>
            <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => toggleExpand(origIdx)}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: proj.title ? "#F5F5F5" : "#525252", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {proj.title || "Untitled Project"}
                </span>
                {proj.subtitle && (
                  <span style={{ fontSize: 12, color: "#737373", fontFamily: "'JetBrains Mono', monospace" }}>
                    {proj.subtitle}{proj.period ? ` · ${proj.period}` : ""}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 ml-3" onClick={(e) => e.stopPropagation()}>
                <ActionBtn onClick={() => moveUp(i)} disabled={i === 0}><ChevronUp size={13} /></ActionBtn>
                <ActionBtn onClick={() => moveDown(i)} disabled={i === sorted.length - 1}><ChevronDown size={13} /></ActionBtn>
                <Toggle checked={proj.isFeatured} onChange={(v) => setItem(origIdx, { isFeatured: v })} label="Featured" />
                <Toggle checked={proj.isVisible} onChange={(v) => setItem(origIdx, { isVisible: v })} label="Visible" />
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
                      value={proj.title}
                      onChange={(e) => {
                        const nextTitle = e.target.value;
                        const shouldAutoSlug = !proj.slug || proj.slug === slugify(proj.title);
                        setItem(origIdx, { title: nextTitle, slug: shouldAutoSlug ? slugify(nextTitle) : proj.slug });
                      }}
                    />
                  </Field>
                  <Field label="Subtitle">
                    <input style={inputStyle} value={proj.subtitle} onChange={(e) => setItem(origIdx, { subtitle: e.target.value })} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Role">
                    <input style={inputStyle} value={proj.role} onChange={(e) => setItem(origIdx, { role: e.target.value })} />
                  </Field>
                  <Field label="Period">
                    <input style={inputStyle} value={proj.period} onChange={(e) => setItem(origIdx, { period: e.target.value })} />
                  </Field>
                  <Field label="Destination">
                    <select style={inputStyle} value={destinationType} onChange={(e) => setItem(origIdx, { destinationType: e.target.value as "external" | "detail" })}>
                      <option value="external">External link</option>
                      <option value="detail">Project detail page</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Slug (auto from title)">
                    <input style={inputStyle} value={proj.slug ?? ""} onChange={(e) => setItem(origIdx, { slug: slugify(e.target.value) })} placeholder="project-slug" />
                  </Field>
                  <Field label="Live Link">
                    <input style={inputStyle} value={proj.link} onChange={(e) => setItem(origIdx, { link: e.target.value })} placeholder={destinationType === "external" ? "https://example.com" : "Optional external link"} />
                  </Field>
                </div>
                {destinationType === "detail" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Video Embed URL (YouTube/Vimeo)">
                      <input style={inputStyle} value={proj.embedVideoUrl ?? ""} onChange={(e) => setItem(origIdx, { embedVideoUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
                    </Field>
                    <Field label="Video File URL (MP4)">
                      <input style={inputStyle} value={proj.videoFileUrl ?? ""} onChange={(e) => setItem(origIdx, { videoFileUrl: e.target.value })} placeholder="/your-repo-name/files/demo.mp4" />
                    </Field>
                  </div>
                )}
                <Field label="Description">
                  <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={proj.description} onChange={(e) => setItem(origIdx, { description: e.target.value })} />
                </Field>
                <Field label="Image URL">
                  <input style={inputStyle} value={proj.imageUrl} onChange={(e) => setItem(origIdx, { imageUrl: e.target.value })} />
                </Field>
                <Field label="Tags">
                  <ItemListEditor
                    items={proj.tags}
                    onChange={(tags) => setItem(origIdx, { tags })}
                    placeholder="e.g. React, TypeScript"
                    addLabel="+ Add tag"
                  />
                </Field>
                <Field label="Bullets">
                  <ItemListEditor
                    items={proj.bullets}
                    onChange={(bullets) => setItem(origIdx, { bullets })}
                    placeholder="Describe a technical detail or achievement…"
                    addLabel="+ Add bullet"
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
