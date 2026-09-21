import { useState, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { SkillCategory } from "@/types/portfolio";
import { Field, inputStyle, cardStyle, Toggle, ActionBtn, ItemListEditor } from "../components/AdminUI";

const autoKey = (label: string) =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `category-${Date.now()}`;

interface Props {
  categories: SkillCategory[];
  onChange: (c: SkillCategory[]) => void;
}

export function SkillsEditor({ categories, onChange }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sorted = [...categories].sort((a, b) => a.order - b.order);

  const setItem = (idx: number, partial: Partial<SkillCategory>) =>
    onChange(categories.map((c, i) => (i === idx ? { ...c, ...partial } : c)));

  const remove = (idx: number) =>
    onChange(categories.filter((_, i) => i !== idx));

  const add = () => {
    const newIdx = categories.length;
    onChange([...categories, { key: `category-${Date.now()}`, label: "", description: "", iconKey: "code2", skills: [], isVisible: true, order: newIdx }]);
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
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Skills</h2>
        <ActionBtn onClick={add}>+ Add</ActionBtn>
      </div>
      <p style={{ fontSize: 12, color: "#525252", marginBottom: 20 }}>Skill categories shown in the Home section (e.g. Technical, Design).</p>

      {categories.length === 0 && (
        <div style={{ ...cardStyle, textAlign: "center", padding: 32, color: "#525252", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
          No skill categories yet — click "+ Add" to get started.
        </div>
      )}

      {sorted.map((cat, i) => {
        const origIdx = categories.indexOf(cat);
        const isExpanded = expanded.has(origIdx);
        const isPending = pendingDelete === origIdx;
        return (
          <div key={i} style={cardStyle}>
            <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => toggleExpand(origIdx)}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: cat.label ? "#F5F5F5" : "#525252", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {cat.label || "Untitled Category"}
                </span>
                {cat.skills.length > 0 && (
                  <span style={{ fontSize: 12, color: "#737373", fontFamily: "'JetBrains Mono', monospace" }}>
                    {cat.skills.slice(0, 3).join(", ")}{cat.skills.length > 3 ? ` +${cat.skills.length - 3} more` : ""}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 ml-3" onClick={(e) => e.stopPropagation()}>
                <ActionBtn onClick={() => moveUp(i)} disabled={i === 0}><ChevronUp size={13} /></ActionBtn>
                <ActionBtn onClick={() => moveDown(i)} disabled={i === sorted.length - 1}><ChevronDown size={13} /></ActionBtn>
                <Toggle checked={cat.isVisible} onChange={(v) => setItem(origIdx, { isVisible: v })} label="Visible" />
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
                <Field label="Label">
                  <input
                    style={inputStyle}
                    value={cat.label}
                    onChange={(e) => {
                      const label = e.target.value;
                      const shouldAutoKey = !cat.key || cat.key === autoKey(cat.label) || cat.key.startsWith("category-");
                      setItem(origIdx, { label, key: shouldAutoKey ? autoKey(label) : cat.key });
                    }}
                  />
                </Field>
                <Field label="Skills">
                  <ItemListEditor
                    items={cat.skills}
                    onChange={(skills) => setItem(origIdx, { skills })}
                    placeholder="e.g. JavaScript, React"
                    addLabel="+ Add skill"
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
