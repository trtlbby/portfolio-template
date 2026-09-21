import type { Education, Achievement } from "@/types/portfolio";
import { Field, inputStyle, cardStyle, ActionBtn, Toggle } from "../components/AdminUI";

interface Props {
  education: Education;
  onChange: (e: Education) => void;
}

export function EducationEditor({ education, onChange }: Props) {
  const set = (partial: Partial<Education>) => onChange({ ...education, ...partial });

  const setThesis = (partial: Partial<Education["thesis"]>) =>
    onChange({ ...education, thesis: { ...education.thesis, ...partial } });

  const setAchievement = (idx: number, partial: Partial<Achievement>) =>
    set({ achievements: education.achievements.map((a, i) => (i === idx ? { ...a, ...partial } : a)) });

  const addAchievement = () =>
    set({ achievements: [...education.achievements, { title: "", period: "" }] });

  const removeAchievement = (idx: number) =>
    set({ achievements: education.achievements.filter((_, i) => i !== idx) });

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Education</h2>

      <div style={cardStyle}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="University">
            <input style={inputStyle} value={education.university} onChange={(e) => set({ university: e.target.value })} />
          </Field>
          <Field label="Location">
            <input style={inputStyle} value={education.location} onChange={(e) => set({ location: e.target.value })} />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Degree">
            <input style={inputStyle} value={education.degree} onChange={(e) => set({ degree: e.target.value })} />
          </Field>
          <Field label="Expected Graduation">
            <input style={inputStyle} value={education.expectedGraduation} onChange={(e) => set({ expectedGraduation: e.target.value })} />
          </Field>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 mb-3">
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>Thesis</h3>
        <Toggle checked={education.thesis.isVisible} onChange={(v) => setThesis({ isVisible: v })} label="Visible" />
      </div>
      <div style={cardStyle}>
        <Field label="Title">
          <input style={inputStyle} value={education.thesis.title} onChange={(e) => setThesis({ title: e.target.value })} />
        </Field>
      </div>

      <div className="flex items-center justify-between mt-6 mb-3">
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>Achievements</h3>
        <ActionBtn onClick={addAchievement}>+ Add</ActionBtn>
      </div>
      {education.achievements.map((ach, i) => (
        <div key={i} style={cardStyle}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#525252" }}>
              #{i + 1}
            </span>
            <ActionBtn danger onClick={() => removeAchievement(i)}>Delete</ActionBtn>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title">
              <input style={inputStyle} value={ach.title} onChange={(e) => setAchievement(i, { title: e.target.value })} />
            </Field>
            <Field label="Period">
              <input style={inputStyle} value={ach.period} onChange={(e) => setAchievement(i, { period: e.target.value })} />
            </Field>
          </div>
        </div>
      ))}

    </div>
  );
}
