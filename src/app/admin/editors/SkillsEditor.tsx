import type { SkillCategory } from "@/types/portfolio";
import { Field, inputStyle, cardStyle, Toggle, ActionBtn } from "../components/AdminUI";

const iconOptions: SkillCategory["iconKey"][] = ["code2", "palette", "brain"];

interface Props {
  categories: SkillCategory[];
  onChange: (c: SkillCategory[]) => void;
}

export function SkillsEditor({ categories, onChange }: Props) {
  const sorted = [...categories].sort((a, b) => a.order - b.order);

  const setItem = (idx: number, partial: Partial<SkillCategory>) => {
    onChange(categories.map((c, i) => (i === idx ? { ...c, ...partial } : c)));
  };

  const remove = (idx: number) => {
    onChange(categories.filter((_, i) => i !== idx));
  };

  const add = () => {
    onChange([
      ...categories,
      {
        key: `category-${Date.now()}`,
        label: "",
        description: "",
        iconKey: "code2",
        skills: [],
        isVisible: true,
        order: categories.length,
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
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Skill Categories</h2>
        <ActionBtn onClick={add}>+ Add</ActionBtn>
      </div>

      {sorted.map((cat, i) => {
        const origIdx = categories.indexOf(cat);
        return (
          <div key={i} style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#525252" }}>
                #{i + 1}
              </span>
              <div className="flex items-center gap-2">
                <ActionBtn onClick={() => moveUp(i)}>↑</ActionBtn>
                <ActionBtn onClick={() => moveDown(i)}>↓</ActionBtn>
                <Toggle checked={cat.isVisible} onChange={(v) => setItem(origIdx, { isVisible: v })} label="Visible" />
                <ActionBtn danger onClick={() => remove(origIdx)}>Delete</ActionBtn>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Key">
                <input style={inputStyle} value={cat.key} onChange={(e) => setItem(origIdx, { key: e.target.value })} />
              </Field>
              <Field label="Label">
                <input style={inputStyle} value={cat.label} onChange={(e) => setItem(origIdx, { label: e.target.value })} />
              </Field>
              <Field label="Icon">
                <select
                  style={inputStyle}
                  value={cat.iconKey}
                  onChange={(e) => setItem(origIdx, { iconKey: e.target.value as SkillCategory["iconKey"] })}
                >
                  {iconOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Description">
              <textarea
                style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
                value={cat.description}
                onChange={(e) => setItem(origIdx, { description: e.target.value })}
              />
            </Field>
            <Field label="Skills (one per line)">
              <textarea
                style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                value={cat.skills.join("\n")}
                onChange={(e) => setItem(origIdx, { skills: e.target.value.split("\n").filter(Boolean) })}
              />
            </Field>
          </div>
        );
      })}
    </div>
  );
}
