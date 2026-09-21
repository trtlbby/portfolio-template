import type { Experience } from "@/types/portfolio";
import { Field, inputStyle, cardStyle, Toggle, ActionBtn } from "../components/AdminUI";

interface Props {
  experiences: Experience[];
  onChange: (e: Experience[]) => void;
}

export function ExperienceEditor({ experiences, onChange }: Props) {
  const sorted = [...experiences].sort((a, b) => a.order - b.order);

  const setItem = (idx: number, partial: Partial<Experience>) => {
    onChange(experiences.map((e, i) => (i === idx ? { ...e, ...partial } : e)));
  };

  const remove = (idx: number) => {
    onChange(experiences.filter((_, i) => i !== idx));
  };

  const add = () => {
    onChange([
      ...experiences,
      {
        role: "",
        company: "",
        period: "",
        location: "",
        current: false,
        bullets: [""],
        isVisible: true,
        order: experiences.length,
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
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Experience</h2>
        <ActionBtn onClick={add}>+ Add</ActionBtn>
      </div>

      {sorted.map((exp, i) => {
        // find original index for setItem/remove
        const origIdx = experiences.indexOf(exp);
        return (
          <div key={i} style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#525252" }}>
                #{i + 1}
              </span>
              <div className="flex items-center gap-2">
                <ActionBtn onClick={() => moveUp(i)}>↑</ActionBtn>
                <ActionBtn onClick={() => moveDown(i)}>↓</ActionBtn>
                <Toggle checked={exp.isVisible} onChange={(v) => setItem(origIdx, { isVisible: v })} label="Visible" />
                <ActionBtn danger onClick={() => remove(origIdx)}>Delete</ActionBtn>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Role">
                <input style={inputStyle} value={exp.role} onChange={(e) => setItem(origIdx, { role: e.target.value })} />
              </Field>
              <Field label="Company">
                <input style={inputStyle} value={exp.company} onChange={(e) => setItem(origIdx, { company: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Period">
                <input style={inputStyle} value={exp.period} onChange={(e) => setItem(origIdx, { period: e.target.value })} />
              </Field>
              <Field label="Location">
                <input style={inputStyle} value={exp.location} onChange={(e) => setItem(origIdx, { location: e.target.value })} />
              </Field>
              <Field label="Current">
                <Toggle checked={exp.current} onChange={(v) => setItem(origIdx, { current: v })} label={exp.current ? "Yes" : "No"} />
              </Field>
            </div>
            <Field label="Bullets (one per line)">
              <textarea
                style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                value={exp.bullets.join("\n")}
                onChange={(e) => setItem(origIdx, { bullets: e.target.value.split("\n").filter(Boolean) })}
              />
            </Field>
          </div>
        );
      })}
    </div>
  );
}
