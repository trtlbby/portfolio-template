import type { PersonalInfo, SocialLink } from "@/types/portfolio";
import { Field, inputStyle, cardStyle, Toggle } from "../components/AdminUI";

interface Props {
  personalInfo: PersonalInfo;
  socialLinks: SocialLink[];
  onChange: (p: PersonalInfo, s: SocialLink[]) => void;
}

export function PersonalInfoEditor({ personalInfo, socialLinks, onChange }: Props) {
  const set = (partial: Partial<PersonalInfo>) =>
    onChange({ ...personalInfo, ...partial }, socialLinks);

  const setSocial = (idx: number, partial: Partial<SocialLink>) => {
    const next = socialLinks.map((s, i) => (i === idx ? { ...s, ...partial } : s));
    onChange(personalInfo, next);
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Personal Info</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name">
          <input
            style={inputStyle}
            value={personalInfo.firstName}
            onChange={(e) => set({ firstName: e.target.value, name: `${e.target.value} ${personalInfo.lastName}` })}
          />
        </Field>
        <Field label="Last Name">
          <input
            style={inputStyle}
            value={personalInfo.lastName}
            onChange={(e) => set({ lastName: e.target.value, name: `${personalInfo.firstName} ${e.target.value}` })}
          />
        </Field>
      </div>

      <Field label="Tagline">
        <input style={inputStyle} value={personalInfo.tagline} onChange={(e) => set({ tagline: e.target.value })} />
      </Field>

      <div style={{ marginBottom: 16 }}>
        <Toggle checked={personalInfo.showTagline} onChange={(v) => set({ showTagline: v })} label="Show tagline" />
      </div>

      <Field label="Location">
        <input style={inputStyle} value={personalInfo.location} onChange={(e) => set({ location: e.target.value })} />
      </Field>

      <Field label="Bio">
        <textarea
          style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
          value={personalInfo.bio}
          onChange={(e) => set({ bio: e.target.value })}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Avatar (front)">
          <input style={inputStyle} value={personalInfo.avatarUrl} onChange={(e) => set({ avatarUrl: e.target.value })} />
        </Field>
        <Field label="Avatar (back / dark mode)">
          <input style={inputStyle} value={personalInfo.avatarBackUrl ?? ""} onChange={(e) => set({ avatarBackUrl: e.target.value })} />
        </Field>
      </div>

      {/* Social Links */}
      <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>Social Links</h3>
      {socialLinks.map((s, i) => (
        <div key={i} style={cardStyle}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{s.platform}</span>
            <Toggle checked={s.isVisible} onChange={(v) => setSocial(i, { isVisible: v })} label="Visible" />
          </div>
          <Field label="URL">
            <input style={inputStyle} value={s.url} onChange={(e) => setSocial(i, { url: e.target.value })} />
          </Field>
        </div>
      ))}
    </div>
  );
}
