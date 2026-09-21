import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProjectsSection } from "@/app/components/sections/ProjectsSection";
import { getPortfolioData } from "@/data/portfolio";
import { DEFAULT_TITLE } from "@/lib/siteMeta";
import type { PortfolioData } from "@/types/portfolio";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Projects — Your Name";
    return () => { document.title = DEFAULT_TITLE; };
  }, []);

  useEffect(() => {
    let mounted = true;
    getPortfolioData()
      .then((data) => {
        if (mounted) setPortfolioData(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !portfolioData) {
    return (
      <div
        style={{
          background: "var(--pf-bg)",
          color: "var(--pf-fg)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
        }}
      >
        loading projects...
      </div>
    );
  }

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

        <ProjectsSection projects={portfolioData.projects} />
      </div>
    </div>
  );
}
