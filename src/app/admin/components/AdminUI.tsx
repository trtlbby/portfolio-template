import type React from "react";

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
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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
      }}
    >
      {children}
    </button>
  );
}
