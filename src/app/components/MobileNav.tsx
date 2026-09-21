import {
  User, FolderOpen, BookOpen, Mail, Sun, Moon,
} from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import type { NavItem } from "@/types/portfolio";

const navIconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>> = {
  user: User,
  "folder-open": FolderOpen,
  "book-open": BookOpen,
  mail: Mail,
};

interface MobileNavProps {
  activeSection: string;
  onNavigate: (id: string) => void;
  navItems: NavItem[];
}

export function MobileNav({ activeSection, onNavigate, navItems }: MobileNavProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        background: "var(--pf-mobilenav-bg)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid var(--pf-mobilenav-border)",
        paddingTop: 8,
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
      }}
      aria-label="Mobile navigation"
    >
      {navItems.map(({ id, label, iconKey }) => {
        const Icon = navIconMap[iconKey] ?? User;
        const isActive = activeSection === id;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 min-w-[48px] min-h-[44px] cursor-pointer"
            style={{
              background: "transparent",
              border: "none",
              color: isActive ? "var(--pf-nav-active)" : "var(--pf-nav-inactive)",
              transition: "color 0.2s",
            }}
            aria-label={label}
            aria-current={isActive ? "true" : undefined}
          >
            <div className="relative">
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              {isActive && (
                <span
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: "var(--pf-nav-active)" }}
                />
              )}
            </div>
            <span
              style={{
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: isActive ? 600 : 400,
                letterSpacing: "0.02em",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="flex flex-col items-center gap-0.5 px-2 py-1 min-w-[48px] min-h-[44px] cursor-pointer"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--pf-nav-inactive)",
          transition: "color 0.2s",
        }}
      >
        {theme === "dark" ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
        <span
          style={{
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 400,
            letterSpacing: "0.02em",
          }}
        >
          {theme === "dark" ? "light" : "dark"}
        </span>
      </button>
    </nav>
  );
}

