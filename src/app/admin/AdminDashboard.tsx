import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PersonalInfoEditor } from "./editors/PersonalInfoEditor";
import { ExperienceEditor } from "./editors/ExperienceEditor";
import { ProjectEditor } from "./editors/ProjectEditor";
import { SkillsEditor } from "./editors/SkillsEditor";
import { EducationEditor } from "./editors/EducationEditor";
import { ContactEditor } from "./editors/ContactEditor";
import { BlogEditor } from "./editors/BlogEditor";
import type { PortfolioData } from "@/types/portfolio";
import type { BlogPost } from "@/types/blog";

const TABS = [
  { id: "personal", label: "Personal" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
  { id: "blog", label: "Blog" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminDashboard() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  // Fetch portfolio data from dev API
  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((d: PortfolioData) => setData(d));
  }, []);

  // Fetch blog posts from dev API
  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((posts: BlogPost[]) => setBlogPosts(Array.isArray(posts) ? posts : []))
      .catch(() => setBlogPosts([]));
  }, []);

  const save = useCallback(async () => {
    if (!data) return;
    setSaving(true);
    try {
      await Promise.all([
        fetch("/api/portfolio", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
        fetch("/api/blog", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(blogPosts) }),
      ]);
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }, [data, blogPosts]);

  const update = useCallback(
    (partial: Partial<PortfolioData>) => {
      if (!data) return;
      const next = { ...data, ...partial };
      setData(next);
      setDirty(true);
    },
    [data],
  );

  if (!data)
    return (
      <div
        style={{
          background: "#0A0A0A",
          color: "#737373",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Loading…
      </div>
    );

  return (
    <div
      style={{
        background: "#0A0A0A",
        color: "#F5F5F5",
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-30 px-6 py-3 flex items-center justify-between"
        style={{
          background: "rgba(10,10,10,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: "4px 12px",
              color: "#A3A3A3",
              fontSize: 13,
            }}
          >
            ← Portfolio
          </button>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              color: "#525252",
            }}
          >
            Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-3">
          {dirty && (
            <span style={{ fontSize: 12, color: "#f59e0b" }}>Unsaved changes</span>
          )}
          <button
            onClick={save}
            disabled={saving || !dirty}
            className="cursor-pointer"
            style={{
              background: dirty ? "#FFF" : "rgba(255,255,255,0.06)",
              color: dirty ? "#0A0A0A" : "#525252",
              fontWeight: 600,
              padding: "6px 20px",
              borderRadius: 999,
              border: "none",
              fontSize: 13,
              opacity: saving ? 0.5 : 1,
              transition: "all .2s",
            }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="px-6 flex gap-1 overflow-x-auto"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingTop: 8 }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="cursor-pointer shrink-0"
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? "#F5F5F5" : "#737373",
              background: activeTab === tab.id ? "rgba(255,255,255,0.06)" : "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #FFF" : "2px solid transparent",
              borderRadius: "8px 8px 0 0",
              transition: "all .15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editor area */}
      <div className="px-6 py-8 max-w-[800px] mx-auto">
        {activeTab === "personal" && (
          <PersonalInfoEditor
            personalInfo={data.personalInfo}
            socialLinks={data.socialLinks}
            onChange={(personalInfo, socialLinks) => update({ personalInfo, socialLinks })}
          />
        )}
        {activeTab === "experience" && (
          <ExperienceEditor
            experiences={data.experiences}
            onChange={(experiences) => update({ experiences })}
          />
        )}
        {activeTab === "projects" && (
          <ProjectEditor
            projects={data.projects}
            onChange={(projects) => update({ projects })}
          />
        )}
        {activeTab === "skills" && (
          <SkillsEditor
            categories={data.skillCategories}
            onChange={(skillCategories) => update({ skillCategories })}
          />
        )}
        {activeTab === "education" && (
          <EducationEditor
            education={data.education}
            onChange={(education) => update({ education })}
          />
        )}
        {activeTab === "contact" && (
          <ContactEditor
            contactInfo={data.contactInfo}
            onChange={(contactInfo) => update({ contactInfo })}
          />
        )}
        {activeTab === "blog" && (
          <BlogEditor
            posts={blogPosts}
            onChange={(posts) => { setBlogPosts(posts); setDirty(true); }}
          />
        )}
      </div>
    </div>
  );
}
