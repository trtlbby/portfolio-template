import type React from "react";
import { useRef } from "react";

/* ── shared styles ── */
export const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  padding: "10px 14px",
  color: "#F5F5F5",
  fontSize: 14,
  width: "100%",
  outline: "none",
  fontFamily: "'Inter', sans-serif",
};

export const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 16,
  padding: 20,
  marginBottom: 12,
};

/* ── Field ── */
export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          color: "#525252",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 6,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

/* ── Toggle ── */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer" style={{ fontSize: 13 }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 36,
          height: 20,
          borderRadius: 999,
          background: checked ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          position: "relative",
          transition: "background .2s",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: checked ? "#FFF" : "#525252",
            position: "absolute",
            top: 2,
            left: checked ? 19 : 2,
            transition: "left .2s, background .2s",
          }}
        />
      </div>
      <span style={{ color: checked ? "#F5F5F5" : "#737373" }}>{label}</span>
    </label>
  );
}

/* ── Small action button ── */
export function ActionBtn({
  children,
  onClick,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer"
      style={{
        background: danger ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${danger ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 8,
        padding: "4px 12px",
        color: danger ? "#ef4444" : "#A3A3A3",
        fontSize: 12,
        fontWeight: 500,
        transition: "all .15s",
        opacity: disabled ? 0.3 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      {children}
    </button>
  );
}

/* ── Individual-row list editor — replaces "one per line" textareas ── */
export function ItemListEditor({
  items,
  onChange,
  placeholder = "Add item…",
  addLabel = "+ Add",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setItem = (idx: number, value: string) =>
    onChange(items.map((v, i) => (i === idx ? value : v)));

  const remove = (idx: number) =>
    onChange(items.filter((_, i) => i !== idx));

  const add = () => {
    onChange([...items, ""]);
    requestAnimationFrame(() => inputRefs.current[items.length]?.focus());
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const next = [...items];
    next.splice(idx + 1, 0, "");
    onChange(next);
    requestAnimationFrame(() => inputRefs.current[idx + 1]?.focus());
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            ref={(el) => { inputRefs.current[i] = el; }}
            style={{ ...inputStyle, flex: 1, padding: "8px 12px" }}
            value={item}
            placeholder={placeholder}
            onChange={(e) => setItem(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            title="Remove"
            style={{
              background: "none",
              border: "none",
              color: "#525252",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 6,
              fontSize: 16,
              lineHeight: 1,
              flexShrink: 0,
              transition: "color .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#525252")}
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        style={{
          background: "none",
          border: "1px dashed rgba(255,255,255,0.1)",
          borderRadius: 8,
          padding: "7px 12px",
          color: "#525252",
          cursor: "pointer",
          fontSize: 12,
          textAlign: "left",
          transition: "border-color .15s, color .15s",
          marginTop: 2,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
          e.currentTarget.style.color = "#A3A3A3";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.color = "#525252";
        }}
      >
        {addLabel}
      </button>
    </div>
  );
}
