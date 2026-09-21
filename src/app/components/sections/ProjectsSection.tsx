import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/portfolio";
import { PillBadge } from "../PillBadge";
import { getProjectImageDimensions, getProjectImageWebpSrcset } from "@/data/projectImages";

interface ProjectsSectionProps {
  projects: Project[];
  limit?: number;
}

export function ProjectsSection({ projects, limit }: ProjectsSectionProps) {
  const navigate = useNavigate();
  const allVisible = projects
    .filter((p) => p.isVisible)
    .sort((a, b) => a.order - b.order);
  const featuredProjects = allVisible.filter((p) => p.isFeatured);
  const nonFeaturedProjects = allVisible.filter((p) => !p.isFeatured);
  const primaryProjects = limit
    ? featuredProjects.slice(0, limit)
    : featuredProjects.length > 0
      ? featuredProjects
      : allVisible;
  const personalProjects = !limit && featuredProjects.length > 0 ? nonFeaturedProjects : [];

  const getDestinationType = (project: Project): "external" | "detail" => {
    if (project.destinationType) return project.destinationType;
    return project.link && project.link !== "#" ? "external" : "detail";
  };

  const isExternalDestination = (project: Project) =>
    getDestinationType(project) === "external" && Boolean(project.link && project.link !== "#");

  const getDetailPath = (project: Project) =>
    project.slug ? `/projects/${project.slug}` : null;

  const renderCardBody = (project: Project) => {
    const imageDimensions = getProjectImageDimensions(project.imageUrl);
    const webpSrcset = getProjectImageWebpSrcset(project.imageUrl);

    return (
      <>
        {/* Image */}
        <div className="relative" style={{ height: 130 }}>
          <picture>
            {webpSrcset && (
              <source
                type="image/webp"
                srcSet={webpSrcset}
                sizes="(max-width: 639px) 100vw, 50vw"
              />
            )}
            <img
              src={project.imageUrl}
              alt={`Screenshot of ${project.title}`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              width={imageDimensions.width}
              height={imageDimensions.height}
              sizes="(max-width: 639px) 100vw, 50vw"
            />
          </picture>
          <div
            className="absolute inset-0"
            style={{ background: "var(--pf-img-overlay)" }}
          />
        </div>

        {/* Body */}
        <div style={{ padding: 16 }}>
          <div className="flex items-start justify-between gap-2 mb-1">
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--pf-fg)", fontFamily: "'Satoshi', sans-serif" }}>
              {project.title}
            </p>
            <ArrowUpRight size={15} color="var(--pf-fg-4)" style={{ flexShrink: 0, marginTop: 2 }} />
          </div>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "var(--pf-fg-4)",
              marginBottom: 8,
            }}
          >
            {project.subtitle}
          </p>
          <p style={{ color: "var(--pf-fg-3)", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <PillBadge key={t}>{t}</PillBadge>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderProjectGrid = (projectList: Project[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {projectList.map((p) => {
        const detailPath = getDetailPath(p);
        const commonProps = {
          className: "rounded-2xl overflow-hidden block no-underline transition-all duration-200",
          style: {
            background: "var(--pf-surface)",
            border: "1px solid var(--pf-border)",
            textDecoration: "none",
          } as const,
          onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
            e.currentTarget.style.borderColor = "var(--pf-border-hover)";
          },
          onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
            e.currentTarget.style.borderColor = "var(--pf-border)";
          },
        };

        if (isExternalDestination(p)) {
          return (
            <a
              key={p.title}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              {...commonProps}
            >
              {renderCardBody(p)}
            </a>
          );
        }

        if (detailPath) {
          return (
            <button
              key={p.title}
              type="button"
              onClick={() => navigate(detailPath)}
              {...commonProps}
              style={{ ...commonProps.style, textAlign: "left", cursor: "pointer" }}
            >
              {renderCardBody(p)}
            </button>
          );
        }

        return (
          <div
            key={p.title}
            {...commonProps}
            style={{ ...commonProps.style, opacity: 0.8 }}
          >
            {renderCardBody(p)}
          </div>
        );
      })}
    </div>
  );

  return (
    <section>
      {/* Heading */}
      <div className="mb-8">
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "var(--pf-fg-4)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: 8,
          }}
        >
          Projects
        </p>
        <div className="flex items-center justify-between gap-4">
          <p
            style={{
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: 700,
              color: "var(--pf-fg)",
              fontFamily: "'Satoshi', sans-serif",
              lineHeight: 1.2,
            }}
          >
            Things I've Built
          </p>
          {limit && (
            <button
              onClick={() => navigate("/projects")}
              style={{
                background: "transparent",
                border: "1px solid var(--pf-border-strong)",
                borderRadius: 999,
                padding: "5px 14px",
                color: "var(--pf-fg-4)",
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--pf-fg)";
                e.currentTarget.style.borderColor = "var(--pf-border-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--pf-fg-4)";
                e.currentTarget.style.borderColor = "var(--pf-border-strong)";
              }}
            >
              view all →
            </button>
          )}
        </div>
      </div>

      {renderProjectGrid(primaryProjects)}

      {personalProjects.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div className="mb-6">
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "var(--pf-fg-4)",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: 8,
              }}
            >
              Personal Projects
            </p>
            <p style={{ color: "var(--pf-fg-3)", fontSize: 13, lineHeight: 1.6, maxWidth: 540 }}>
              Internal tools and side builds I use to sharpen my workflow.
            </p>
          </div>

          {renderProjectGrid(personalProjects)}
        </div>
      )}
    </section>
  );
}
