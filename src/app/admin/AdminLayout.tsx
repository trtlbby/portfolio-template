import { useState } from "react";
import { AdminDashboard } from "./AdminDashboard";

export default function AdminLayout() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_authed") === "1");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === import.meta.env.VITE_ADMIN_PIN) {
      sessionStorage.setItem("admin_authed", "1");
      setAuthed(true);
      setError("");
    } else {
      setError("Invalid PIN");
    }
  };

  if (authed) return <AdminDashboard />;

  return (
    <div
      style={{
        background: "var(--adm-bg)",
        color: "var(--adm-fg)",
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--adm-surface)",
          border: "1px solid var(--adm-border)",
          borderRadius: 16,
          padding: 32,
          width: 320,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "var(--adm-fg-subtle)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: 8,
          }}
        >
          Admin Panel
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Enter PIN</h1>
        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="••••"
          maxLength={8}
          autoFocus
          className="w-full outline-none text-center"
          style={{
            background: "var(--adm-input-bg)",
            border: "1px solid var(--adm-input-border)",
            borderRadius: 12,
            padding: "12px 16px",
            color: "var(--adm-fg)",
            fontSize: 20,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.3em",
            marginBottom: 12,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--adm-input-border)"; }}
        />
        {error && (
          <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>{error}</p>
        )}
        <button
          type="submit"
          className="w-full cursor-pointer"
          style={{
            background: "var(--adm-fg)",
            color: "var(--adm-bg)",
            fontWeight: 600,
            padding: "10px 0",
            borderRadius: 999,
            border: "none",
            fontSize: 14,
            transition: "all .2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
