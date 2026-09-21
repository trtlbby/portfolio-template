import { useState, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { Experience } from "@/types/portfolio";
import { Field, inputStyle, cardStyle, Toggle, ActionBtn, ItemListEditor } from "../components/AdminUI";

interface Props {
  experiences: Experience[];
  onChange: (e: Experience[]) => void;
}

export function ExperienceEditor({ experiences, onChange }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sorted = [...experiences].sort((a, b) => a.order - b.order);

  const setItem = (idx: number, partial: Partial<Experience>) =>
    onChange(experiences.map((e, i) => (i === idx ? { ...e, ...partial } : e)));

  const remove = (idx: number) =>
    onChange(experiences.filter((_, i) => i !== idx));

  const add = () => {
    const newIdx = experiences.length;
    onChange([...experiences, { role: "", company: "", period: "", location: "", current: false, bullets: [""], isVisible: true, order: newIdx }]);
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
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Experience</h2>
        <ActionBtn onClick={add}>+ Add</ActionBtn>
      </div>
      <p style={{ fontSize: 12, color: "#525252", marginBottom: 20 }}>Jobs, internships, volunteer work, and other relevant positions.</p>

      {experiences.length === 0 && (
        <div style={{ ...cardStyle, textAlign: "center", padding: 32, color: "#525252", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
          No experience entries yet — click "+ Add" to get started.
        </div>
      )}

      {sorted.map((exp, i) => {
        const origIdx = experiences.indexOf(exp);
        const isExpanded = expanded.has(origIdx);
        const isPending = pendingDelete === origIdx;
        return (
          <div key={i} style={cardStyle}>
            <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => toggleExpand(origIdx)}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: exp.role ? "#F5F5F5" : "#525252", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {exp.role || "Untitled Role"}
                </span>
                {exp.company && (
                  <span style={{ fontSize: 12, color: "#737373", fontFamily: "'JetBrains Mono', monospace" }}>
                    {exp.company}{exp.period ? ` · ${exp.period}` : ""}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 ml-3" onClick={(e) => e.stopPropagation()}>
                <ActionBtn onClick={() => moveUp(i)} disabled={i === 0}><ChevronUp size={13} /></ActionBtn>
                <ActionBtn onClick={() => moveDown(i)} disabled={i === sorted.length - 1}><ChevronDown size={13} /></ActionBtn>
                <Toggle checked={exp.isVisible} onChange={(v) => setItem(origIdx, { isVisible: v })} label="Visible" />
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
                  <Field label="Role">
                    <input style={inputStyle} value={exp.role} onChange={(e) => setItem(origIdx, { role: e.target.value })} />
                  </Field>
                  <Field label="Company">
                    <input style={inputStyle} value={exp.company} onChange={(e) => setItem(origIdx, { company: e.target.value })} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Period">
                    <input style={inputStyle} value={exp.period} placeholder="e.g. Jan 2025 – Present" onChange={(e) => setItem(origIdx, { period: e.target.value })} />
                  </Field>
                  <Field label="Location">
                    <input style={inputStyle} value={exp.location} onChange={(e) => setItem(origIdx, { location: e.target.value })} />
                  </Field>
                </div>
                <Field label="Bullets">
                  <ItemListEditor
                    items={exp.bullets}
                    onChange={(bullets) => setItem(origIdx, { bullets })}
                    placeholder="Describe a responsibility or achievement…"
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
