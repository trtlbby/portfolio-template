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
        background: "#0A0A0A",
        color: "#F5F5F5",
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
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
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
            color: "#525252",
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
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "12px 16px",
            color: "#F5F5F5",
            fontSize: 20,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.3em",
            marginBottom: 12,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
        />
        {error && (
          <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>{error}</p>
        )}
        <button
          type="submit"
          className="w-full cursor-pointer"
          style={{
            background: "#FFF",
            color: "#0A0A0A",
            fontWeight: 600,
            padding: "10px 0",
            borderRadius: 999,
            border: "none",
            fontSize: 14,
            transition: "all .2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#D4D4D4"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#FFF"; }}
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
