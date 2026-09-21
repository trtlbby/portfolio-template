import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { Sidebar } from "./components/Sidebar";
import { MobileNav } from "./components/MobileNav";
import { HomeSection } from "./components/sections/HomeSection";
import { ProjectsSection } from "./components/sections/ProjectsSection";
import { BlogSection } from "./components/sections/BlogSection";
import { ContactSection } from "./components/sections/ContactSection";
import { getPortfolioData } from "@/data/portfolio";
import type { PortfolioData } from "@/types/portfolio";

export default function App() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sections = useMemo(() => portfolioData?.navItems.map((n) => n.id) ?? [], [portfolioData]);

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

  useEffect(() => {
    if (sections.length > 0 && !sections.includes(activeSection)) {
      setActiveSection(sections[0]!);
    }
  }, [sections, activeSection]);

  // Reveal sections already in the viewport synchronously before the browser
  // paints — useLayoutEffect fires after DOM commit but before paint, so
  // getBoundingClientRect() returns accurate values and there is no flash of
  // invisible content on any navigation type (including back/forward).
  // NOTE: `loading` must be in the dep array because portfolioData is set in
  // .then() and loading is cleared in .finally() — two separate microtasks,
  // two separate renders. sections changes in Render 1 (loading still true,
  // no <main> yet), so we gate on !loading to defer to Render 2.
  useLayoutEffect(() => {
    if (sections.length === 0 || loading) return;
    const container = contentRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    sections.forEach((id) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom > containerRect.top && rect.top < containerRect.bottom) {
        el.classList.add("visible");
      }
    });
  }, [sections, loading]);

  // Scroll-triggered reveal for sections below the fold
  useEffect(() => {
    if (sections.length === 0 || loading) return;
    const container = contentRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        }
      },
      { threshold: 0.1, root: container }
    );

    sections.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, loading]);

  // Active nav tracking via scroll position
  useEffect(() => {
    if (sections.length === 0 || loading) return;

    const container = contentRef.current;
    if (!container) return;

    const onScroll = () => {
      // If scrolled to (or near) the bottom, always activate the last section
      if (container.scrollHeight - container.scrollTop - container.clientHeight < 60) {
        setActiveSection(sections[sections.length - 1]!);
        return;
      }

      const containerTop = container.getBoundingClientRect().top;
      let active = sections[0]!;
      for (const id of sections) {
        const el = sectionRefs.current[id];
        if (el && el.getBoundingClientRect().top - containerTop <= 100) {
          active = id;
        }
      }
      setActiveSection(active);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [sections, loading]);

  const handleNavigate = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
        loading portfolio...
      </div>
    );
  }

  return (
    <div
      className="h-screen overflow-hidden"
      style={{
        background: "var(--pf-bg)",
        color: "var(--pf-fg)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <MobileNav
        activeSection={activeSection}
        onNavigate={handleNavigate}
        navItems={portfolioData.navItems}
      />

      {/* Skip to content */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg"
        style={{ background: "var(--pf-fg)", color: "var(--pf-bg)", fontWeight: 600 }}
      >
        Skip to content
      </a>

      {/* Desktop: centered two-column layout */}
      <div className="h-full flex justify-center">
        <div className="flex h-full w-full max-w-[1060px] px-4 lg:px-8">
          <Sidebar
            activeSection={activeSection}
            onNavigate={handleNavigate}
            navItems={portfolioData.navItems}
          />

          {/* Main content area */}
          <main
            ref={contentRef}
            className="flex-1 h-full overflow-y-auto no-scrollbar"
          >
            <div className="px-4 sm:px-8 pt-16 pb-24 lg:pb-16 max-w-[860px] mx-auto lg:mx-0">
              {sections.map((id, i) => (
                <div
                  key={id}
                  id={id}
                  ref={(el) => { sectionRefs.current[id] = el; }}
                  className="section-reveal"
                  style={{
                    paddingBottom: 80,
                    paddingTop: i > 0 ? 32 : 0,
                    borderBottom: i < sections.length - 1 ? "1px solid var(--pf-divider)" : "none",
                  }}
                >
                  {id === "home" && (
                    <HomeSection
                      personalInfo={portfolioData.personalInfo}
                      skillCategories={portfolioData.skillCategories}
                      experiences={portfolioData.experiences}
                      education={portfolioData.education}
                      socialLinks={portfolioData.socialLinks}
                    />
                  )}
                  {id === "projects" && <ProjectsSection projects={portfolioData.projects} limit={4} />}
                  {id === "blog" && <BlogSection limit={4} />}
                  {id === "contact" && (
                    <ContactSection
                      contactInfo={portfolioData.contactInfo}
                      socialLinks={portfolioData.socialLinks}
                      personalInfo={portfolioData.personalInfo}
                    />
                  )}
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}