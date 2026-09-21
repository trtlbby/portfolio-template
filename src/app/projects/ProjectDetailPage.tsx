import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPortfolioData } from "@/data/portfolio";
import { getProjectImageDimensions, getProjectImageWebpSrcset } from "@/data/projectImages";
import { PillBadge } from "@/app/components/PillBadge";
import { DEFAULT_TITLE } from "@/lib/siteMeta";
import type { PortfolioData } from "@/types/portfolio";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

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

  const project = portfolioData?.projects.find((p) => p.slug === slug);

  useEffect(() => {
    if (project) {
      document.title = `${project.title} — Your Name`;
    }
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [project]);

  const hasExternalLink = Boolean(project?.link && project.link !== "#");
  const embedVideoUrl = project?.embedVideoUrl?.trim() ?? "";
  const videoFileUrl = project?.videoFileUrl?.trim() ?? "";
  const imageDimensions = project ? getProjectImageDimensions(project.imageUrl) : { width: 16, height: 9 };
  const webpSrcset = project ? getProjectImageWebpSrcset(project.imageUrl) : undefined;

  if (loading || !portfolioData) {
    return (
      <div
        style={{
          background: "var(--pf-bg)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--pf-fg-4)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
        }}
      >
        loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div
        style={{
          background: "var(--pf-bg)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "var(--pf-fg-4)",
          }}
        >
          // 404
        </p>
        <p style={{ color: "var(--pf-fg-3)", fontSize: 15 }}>Project not found.</p>
        <button
          onClick={() => navigate("/projects")}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--pf-fg-3)",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "'Satoshi', sans-serif",
            textDecoration: "underline",
            textUnderlineOffset: 4,
          }}
        >
          Go to projects
        </button>
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

        <div style={{ marginBottom: 22 }}>
          <picture>
            {webpSrcset && (
              <source
                type="image/webp"
                srcSet={webpSrcset}
                sizes="(max-width: 860px) 100vw, 860px"
              />
            )}
            <img
              src={project.imageUrl}
              alt={`Preview of ${project.title}`}
              className="w-full object-cover rounded-2xl"
              style={{
                maxHeight: 390,
                border: "1px solid var(--pf-border)",
                background: "var(--pf-surface)",
              }}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              width={imageDimensions.width}
              height={imageDimensions.height}
              sizes="(max-width: 860px) 100vw, 860px"
            />
          </picture>
        </div>

        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 700,
            color: "var(--pf-fg)",
            fontFamily: "'Satoshi', sans-serif",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: 10,
          }}
        >
          {project.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2" style={{ marginBottom: 16 }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: "var(--pf-fg-4)",
            }}
          >
            {project.subtitle}
          </p>
          <span style={{ color: "var(--pf-fg-4)", fontSize: 12 }}>•</span>
          <p style={{ fontSize: 13, color: "var(--pf-fg-4)", fontFamily: "'JetBrains Mono', monospace" }}>
            {project.role} · {project.period}
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <p style={{ color: "var(--pf-fg-3)", fontSize: 15, lineHeight: 1.8, maxWidth: 760 }}>
            {project.description}
          </p>
        </div>

        {hasExternalLink && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 no-underline"
            style={{
              background: "var(--pf-action-bg)",
              border: "1px solid var(--pf-action-border)",
              borderRadius: 999,
              padding: "8px 16px",
              color: "var(--pf-action-fg)",
              fontSize: 13,
              marginBottom: 30,
            }}
          >
            Visit live project
            <ArrowUpRight size={14} />
          </a>
        )}

        <section style={{ marginBottom: 28 }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "var(--pf-fg-4)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: 12,
            }}
          >
            Demo Video
          </p>

          {embedVideoUrl ? (
            <div style={{ border: "1px solid var(--pf-border)", borderRadius: 16, overflow: "hidden", background: "var(--pf-surface)" }}>
              <iframe
                src={embedVideoUrl}
                title={`${project.title} demo video`}
                style={{ width: "100%", aspectRatio: "16 / 9", border: "none", display: "block" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : videoFileUrl ? (
            <div style={{ border: "1px solid var(--pf-border)", borderRadius: 16, overflow: "hidden", background: "var(--pf-surface)" }}>
              <video
                controls
                preload="metadata"
                poster={project.imageUrl}
                playsInline
                style={{ width: "100%", display: "block" }}
              >
                <source src={videoFileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div
              style={{
                border: "1px dashed var(--pf-border-strong)",
                borderRadius: 16,
                background: "var(--pf-surface)",
                padding: "26px 20px",
              }}
            >
              <p style={{ color: "var(--pf-fg-2)", fontSize: 15, marginBottom: 6, fontWeight: 600 }}>
                Demo coming soon
              </p>
              <p style={{ color: "var(--pf-fg-4)", fontSize: 13, lineHeight: 1.6 }}>
                A walkthrough video for this project is not available yet.
              </p>
            </div>
          )}
        </section>

        <section style={{ marginBottom: 28 }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "var(--pf-fg-4)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: 12,
            }}
          >
            Key Features
          </p>
          <ul style={{ margin: 0, paddingLeft: 20, color: "var(--pf-fg-3)", fontSize: 14, lineHeight: 1.8 }}>
            {project.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>

        <section>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "var(--pf-fg-4)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: 12,
            }}
          >
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <PillBadge key={tag}>{tag}</PillBadge>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
