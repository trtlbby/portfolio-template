import type { ContactInfo } from "@/types/portfolio";
import { Field, inputStyle } from "../components/AdminUI";

interface Props {
  contactInfo: ContactInfo;
  onChange: (c: ContactInfo) => void;
}

export function ContactEditor({ contactInfo, onChange }: Props) {
  const set = (partial: Partial<ContactInfo>) => onChange({ ...contactInfo, ...partial });

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Contact Info</h2>

      <Field label="Email">
        <input style={inputStyle} value={contactInfo.email} onChange={(e) => set({ email: e.target.value })} />
      </Field>
      <Field label="Phone">
        <input style={inputStyle} value={contactInfo.phone} onChange={(e) => set({ phone: e.target.value })} />
      </Field>
      <Field label="Location">
        <input style={inputStyle} value={contactInfo.location} onChange={(e) => set({ location: e.target.value })} />
      </Field>
    </div>
  );
}
