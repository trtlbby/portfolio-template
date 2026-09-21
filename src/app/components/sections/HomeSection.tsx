import { useState, useEffect } from "react";
import { MapPin, Eye, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../icons";
import { PillBadge } from "../PillBadge";
import { useTheme } from "@/app/context/ThemeContext";
import type { PersonalInfo, SkillCategory, Experience, Education, SocialLink } from "@/types/portfolio";

interface HomeSectionProps {
  personalInfo: PersonalInfo;
  skillCategories: SkillCategory[];
  experiences: Experience[];
  education: Education;
  socialLinks: SocialLink[];
}

const socialIconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: Mail,
};

function HighlightedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <span key={i} style={{ color: "var(--pf-fg)", fontWeight: 500 }}>
            {part.slice(2, -2)}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

function getInitials(name: string): string {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

const deanListCount = (achievements: Education["achievements"]) =>
  achievements.filter((a) => a.title === "Dean's List").length;

const cardSurface: React.CSSProperties = {
  background: "var(--pf-surface)",
  border: "1px solid var(--pf-border)",
  borderRadius: 16,
};

export function HomeSection({ personalInfo, skillCategories, experiences, education, socialLinks }: HomeSectionProps) {
  const [activeTab, setActiveTab] = useState<"experience" | "education">("experience");
  const { theme } = useTheme();

  // dark mode → flipped (avatarThree visible), light mode → not flipped (avatarTwo visible)
  const [flipped, setFlipped] = useState(theme === "dark");

  useEffect(() => {
    setFlipped(theme === "dark");
  }, [theme]);

  const avatarFront = personalInfo.avatarUrl;
  const avatarBack = personalInfo.avatarBackUrl ?? personalInfo.avatarUrl;

  const visibleSocials = socialLinks
    .filter((s) => s.isVisible)
    .sort((a, b) => a.order - b.order);

  const visibleExperiences = experiences
    .filter((e) => e.isVisible)
    .sort((a, b) => a.order - b.order);

  const visibleSkills = skillCategories
    .filter((c) => c.isVisible)
    .sort((a, b) => a.order - b.order);

  const firstName = (personalInfo.firstName.split(" ")[0] ?? personalInfo.firstName).toLowerCase();

  return (
    <section>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="flex flex-col-reverse md:flex-row md:items-start md:justify-between gap-10 mb-16">
        {/* Left */}
        <div className="flex-1 min-w-0">
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "var(--pf-fg-4)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: 14,
            }}
          >
            Software Developer
          </p>

          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              color: "var(--pf-fg)",
              fontFamily: "'Satoshi', sans-serif",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            hi im {firstName}.
          </h1>

          {personalInfo.showTagline && personalInfo.tagline && (
            <p
              style={{
                color: "var(--pf-fg-2)",
                fontSize: 15,
                lineHeight: 1.75,
                maxWidth: 560,
                marginBottom: 16,
              }}
            >
              {personalInfo.tagline}
            </p>
          )}

          <p
            style={{
              color: "var(--pf-fg-2)",
              fontSize: 15,
              lineHeight: 1.75,
              maxWidth: 480,
              marginBottom: 20,
            }}
          >
            <HighlightedText text={personalInfo.bio} />
          </p>

          {/* Location */}
          <div className="flex items-center gap-1.5 mb-6">
            <MapPin size={13} color="var(--pf-fg-4)" />
            <span style={{ color: "var(--pf-fg-4)", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
              {personalInfo.location}
            </span>
          </div>

          {/* Actions row */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {/* Resume view */}
            <a
              href={`${import.meta.env.BASE_URL}files/resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 no-underline cursor-pointer"
              style={{
                background: "var(--pf-action-bg)",
                border: "1px solid var(--pf-action-border)",
                borderRadius: 999,
                padding: "8px 18px",
                color: "var(--pf-action-fg)",
                fontSize: 13,
                fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--pf-action-border-hover)";
                e.currentTarget.style.color = "var(--pf-action-fg-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--pf-action-border)";
                e.currentTarget.style.color = "var(--pf-action-fg)";
              }}
            >
              <Eye size={13} />
              Resume
            </a>

            {/* Social icon buttons */}
            {visibleSocials.map((s, i) => {
              const Icon = socialIconMap[s.platform] ?? Mail;
              return (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.platform} profile`}
                  className="w-9 h-9 flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "var(--pf-action-bg)",
                    border: "1px solid var(--pf-border-strong)",
                    borderRadius: 999,
                    color: "var(--pf-fg-4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--pf-action-fg-hover)";
                    e.currentTarget.style.borderColor = "var(--pf-action-border-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--pf-fg-4)";
                    e.currentTarget.style.borderColor = "var(--pf-border-strong)";
                  }}
                >
                  <Icon size={15} color="currentColor" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Right: Avatar – flip card */}
        <div className="flex-shrink-0 flex items-start justify-center md:justify-end" style={{ marginTop: 4 }}>
          <div
            style={{ width: 148, height: 176, perspective: 600, cursor: "pointer" }}
            onMouseEnter={() => setFlipped((f) => !f)}
            onMouseLeave={() => setFlipped(theme === "dark")}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 0.6s cubic-bezier(0.4,0.2,0.2,1)",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <img
                src={avatarFront}
                alt={personalInfo.name}
                className="rounded-2xl object-cover absolute inset-0"
                style={{ width: "100%", height: "100%", backfaceVisibility: "hidden" }}
                loading="eager"
                fetchPriority="high"
                width={148}
                height={176}
              />
              {/* Back */}
              <img
                src={avatarBack}
                alt={personalInfo.name}
                className="rounded-2xl object-cover absolute inset-0"
                style={{
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
                loading="lazy"
                width={148}
                height={176}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Skills ───────────────────────────────────────────── */}
      <div className="mb-16">
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "var(--pf-fg-4)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: 16,
          }}
        >
          Stack &amp; Skills
        </p>
        <div className="space-y-3">
          {visibleSkills.map((cat) => (
            <div key={cat.key} className="flex items-start gap-4">
              <span
                style={{
                  minWidth: 80,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "var(--pf-fg-4)",
                  paddingTop: 4,
                  textTransform: "lowercase",
                }}
              >
                {cat.key}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((skill) => (
                  <PillBadge key={skill}>{skill}</PillBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Work / Education Tabs ─────────────────────────────── */}
      <div>
        {/* Tab bar */}
        <div
          className="inline-flex mb-4"
          style={{
            background: "var(--pf-tab-bg)",
            border: "1px solid var(--pf-tab-border)",
            borderRadius: 10,
            padding: 4,
          }}
        >
          {(["experience", "education"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="cursor-pointer"
              style={{
                background: activeTab === tab ? "var(--pf-tab-active-bg)" : "transparent",
                border: activeTab === tab ? "1px solid var(--pf-tab-active-border)" : "1px solid transparent",
                borderRadius: 7,
                padding: "6px 16px",
                color: activeTab === tab ? "var(--pf-tab-active-fg)" : "var(--pf-tab-inactive-fg)",
                fontSize: 13,
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: activeTab === tab ? 600 : 400,
                transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content container */}
        <div style={{ ...cardSurface, padding: 0, overflow: "hidden" }}>
          {activeTab === "experience" ? (
            visibleExperiences.map((exp, i) => (
              <EntryCard
                key={i}
                monogram={getInitials(exp.company)}
                title={exp.role}
                period={exp.period}
                subtitle={exp.company + " · " + exp.location}
                bullets={exp.bullets}
                isFirst={i === 0}
              />
            ))
          ) : (
            <EntryCard
              monogram={getInitials(education.university)}
              title={education.degree}
              period={`Expected ${education.expectedGraduation}`}
              subtitle={education.university + " · " + education.location}
              bullets={[]}
              chips={[
                ...(deanListCount(education.achievements) > 0
                  ? [`Dean's List ×${deanListCount(education.achievements)}`]
                  : []),
                ...education.achievements
                  .filter((a) => a.title !== "Dean's List")
                  .map((a) => a.title),
                ...(education.thesis.isVisible ? [`Thesis: ${education.thesis.title}`] : []),
              ]}
              isFirst
            />
          )}
        </div>
      </div>
    </section>
  );
}

interface EntryCardProps {
  monogram: string;
  title: string;
  period: string;
  subtitle: string;
  bullets: string[];
  chips?: string[];
  isFirst: boolean;
}

function EntryCard({ monogram, title, period, subtitle, bullets, chips, isFirst }: EntryCardProps) {
  return (
    <div
      style={{
        borderTop: isFirst ? "none" : "1px solid var(--pf-divider)",
        padding: "20px 20px",
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
      }}
    >
      {/* Monogram circle */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "var(--pf-action-bg)",
          border: "1px solid var(--pf-border-strong)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: "var(--pf-fg-3)",
          fontWeight: 600,
        }}
      >
        {monogram}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--pf-fg)", fontFamily: "'Satoshi', sans-serif", lineHeight: 1.4 }}>
            {title}
          </p>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--pf-fg-4)", whiteSpace: "nowrap", paddingTop: 3 }}>
            {period}
          </span>
        </div>
        <p style={{ fontSize: 12, color: "var(--pf-fg-4)", marginBottom: bullets.length || chips?.length ? 10 : 0, fontFamily: "'JetBrains Mono', monospace" }}>
          {subtitle}
        </p>

        {bullets.length > 0 && (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }} className="space-y-1 mb-3">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2" style={{ color: "var(--pf-fg-3)", fontSize: 13, lineHeight: 1.6 }}>
                <span style={{ marginTop: 7, minWidth: 3, height: 3, borderRadius: "50%", background: "var(--pf-fg-4)", display: "inline-block", flexShrink: 0 }} />
                {b}
              </li>
            ))}
          </ul>
        )}

        {chips && chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {chips.map((c) => (
              <PillBadge key={c}>{c}</PillBadge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
