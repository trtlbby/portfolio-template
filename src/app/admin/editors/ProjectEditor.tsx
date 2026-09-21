import type { Project } from "@/types/portfolio";
import { Field, inputStyle, cardStyle, Toggle, ActionBtn } from "../components/AdminUI";

interface Props {
  projects: Project[];
  onChange: (p: Project[]) => void;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function ProjectEditor({ projects, onChange }: Props) {
  const sorted = [...projects].sort((a, b) => a.order - b.order);

  const setItem = (idx: number, partial: Partial<Project>) => {
    onChange(projects.map((p, i) => (i === idx ? { ...p, ...partial } : p)));
  };

  const remove = (idx: number) => {
    onChange(projects.filter((_, i) => i !== idx));
  };

  const add = () => {
    onChange([
      ...projects,
      {
        title: "",
        subtitle: "",
        role: "",
        period: "",
        description: "",
        tags: [],
        bullets: [""],
        imageUrl: "",
        link: "",
        destinationType: "detail",
        slug: "",
        embedVideoUrl: "",
        videoFileUrl: "",
        isFeatured: false,
        isVisible: true,
        order: projects.length,
      },
    ]);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...sorted];
    const prevOrder = next[idx - 1]!.order;
    next[idx - 1]!.order = next[idx]!.order;
    next[idx]!.order = prevOrder;
    onChange(next);
  };

  const moveDown = (idx: number) => {
    if (idx >= sorted.length - 1) return;
    const next = [...sorted];
    const nextOrder = next[idx + 1]!.order;
    next[idx + 1]!.order = next[idx]!.order;
    next[idx]!.order = nextOrder;
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Projects</h2>
        <ActionBtn onClick={add}>+ Add</ActionBtn>
      </div>

      {sorted.map((proj, i) => {
        const origIdx = projects.indexOf(proj);
        const destinationType = proj.destinationType ?? "external";
        return (
          <div key={i} style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#525252" }}>
                #{i + 1}
              </span>
              <div className="flex items-center gap-2">
                <ActionBtn onClick={() => moveUp(i)}>↑</ActionBtn>
                <ActionBtn onClick={() => moveDown(i)}>↓</ActionBtn>
                <Toggle checked={proj.isFeatured} onChange={(v) => setItem(origIdx, { isFeatured: v })} label="Featured" />
                <Toggle checked={proj.isVisible} onChange={(v) => setItem(origIdx, { isVisible: v })} label="Visible" />
                <ActionBtn danger onClick={() => remove(origIdx)}>Delete</ActionBtn>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Title">
                <input
                  style={inputStyle}
                  value={proj.title}
                  onChange={(e) => {
                    const nextTitle = e.target.value;
                    const previousGeneratedSlug = slugify(proj.title);
                    const nextGeneratedSlug = slugify(nextTitle);
                    const shouldAutoGenerateSlug = !proj.slug || proj.slug === previousGeneratedSlug;

                    setItem(origIdx, {
                      title: nextTitle,
                      slug: shouldAutoGenerateSlug ? nextGeneratedSlug : proj.slug,
                    });
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
                <select
                  style={inputStyle}
                  value={destinationType}
                  onChange={(e) => setItem(origIdx, { destinationType: e.target.value as "external" | "detail" })}
                >
                  <option value="external">External link</option>
                  <option value="detail">Project detail page</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Slug (auto from title, editable)">
                <input
                  style={inputStyle}
                  value={proj.slug ?? ""}
                  onChange={(e) => setItem(origIdx, { slug: slugify(e.target.value) })}
                  placeholder="project-slug"
                />
              </Field>
              <Field label="Live Link">
                <input
                  style={inputStyle}
                  value={proj.link}
                  onChange={(e) => setItem(origIdx, { link: e.target.value })}
                  placeholder={destinationType === "external" ? "https://example.com" : "Optional external link"}
                />
              </Field>
            </div>
            {destinationType === "detail" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Video Embed URL (YouTube/Vimeo)">
                  <input
                    style={inputStyle}
                    value={proj.embedVideoUrl ?? ""}
                    onChange={(e) => setItem(origIdx, { embedVideoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </Field>
                <Field label="Video File URL (MP4)">
                  <input
                    style={inputStyle}
                    value={proj.videoFileUrl ?? ""}
                    onChange={(e) => setItem(origIdx, { videoFileUrl: e.target.value })}
                    placeholder="/Portfolio/files/demo.mp4"
                  />
                </Field>
              </div>
            )}
            <Field label="Description">
              <textarea
                style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                value={proj.description}
                onChange={(e) => setItem(origIdx, { description: e.target.value })}
              />
            </Field>
            <Field label="Image URL">
              <input style={inputStyle} value={proj.imageUrl} onChange={(e) => setItem(origIdx, { imageUrl: e.target.value })} />
            </Field>
            <Field label="Tags (comma separated)">
              <input
                style={inputStyle}
                value={proj.tags.join(", ")}
                onChange={(e) => setItem(origIdx, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
              />
            </Field>
            <Field label="Bullets (one per line)">
              <textarea
                style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                value={proj.bullets.join("\n")}
                onChange={(e) => setItem(origIdx, { bullets: e.target.value.split("\n").filter(Boolean) })}
              />
            </Field>
          </div>
        );
      })}
    </div>
  );
}
