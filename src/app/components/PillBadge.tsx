const pillStyle: React.CSSProperties = {
  background: "var(--pf-action-bg)",
  border: "1px solid var(--pf-border-strong)",
  borderRadius: "999px",
  padding: "4px 12px",
  fontSize: "10px",
  color: "var(--pf-fg-3)",
  fontFamily: "'JetBrains Mono', monospace",
};

export function PillBadge({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <span style={{ ...pillStyle, ...style }}>{children}</span>;
}
