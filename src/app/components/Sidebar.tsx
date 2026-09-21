import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import type { NavItem } from "@/types/portfolio";

interface SidebarProps {
  activeSection: string;
  onNavigate: (id: string) => void;
  navItems: NavItem[];
}

export function Sidebar({ activeSection, onNavigate, navItems }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className="hidden lg:flex flex-col flex-shrink-0 sticky top-0 z-40"
      style={{
        width: 140,
        height: "100vh",
        paddingTop: 48,
        paddingRight: 32,
      }}
    >
      <nav aria-label="Main navigation" className="flex-1">
        <ul className="space-y-0.5">
          {navItems.map(({ id, label }) => {
            const isActive = activeSection === id;
            return (
              <li key={id}>
                <button
                  onClick={() => onNavigate(id)}
                  className="w-full text-left cursor-pointer"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "6px 0",
                    color: isActive ? "var(--pf-nav-active)" : "var(--pf-nav-inactive)",
                    fontSize: isActive ? 16 : 14,
                    fontWeight: isActive ? 600 : 400,
                    fontFamily: "'Satoshi', sans-serif",
                    textDecorationLine: isActive ? "underline" : "none",
                    textDecorationThickness: "1px",
                    textUnderlineOffset: "6px",
                    transform: isActive ? "translateX(8px)" : "translateX(0)",
                    transition: "all 0.2s ease",
                    display: "block",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--pf-nav-hover)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--pf-nav-inactive)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }
                  }}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme toggle */}
      <div style={{ paddingBottom: 48 }}>
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="cursor-pointer flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "var(--pf-action-bg)",
            border: "1px solid var(--pf-border-strong)",
            color: "var(--pf-fg-4)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--pf-border-hover)";
            e.currentTarget.style.color = "var(--pf-fg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--pf-border-strong)";
            e.currentTarget.style.color = "var(--pf-fg-4)";
          }}
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </aside>
  );
}
