import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BlogSection } from "@/app/components/sections/BlogSection";
import { DEFAULT_TITLE } from "@/lib/siteMeta";

export default function BlogListPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Blog — Your Name";
    return () => { document.title = DEFAULT_TITLE; };
  }, []);

  return (
    <div
      className="no-scrollbar"
      style={{
        background: "var(--pf-bg)",
        color: "var(--pf-fg)",
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "48px 24px 96px",
        }}
      >
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 cursor-pointer"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--pf-fg-4)",
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 48,
            padding: 0,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pf-fg-link)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pf-fg-4)")}
        >
          <ArrowLeft size={13} />
          back
        </button>

        <BlogSection />
      </div>
    </div>
  );
}
