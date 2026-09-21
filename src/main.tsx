
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
  import App from "./app/App.tsx";
  import { ThemeProvider } from "./app/context/ThemeContext.tsx";
  import "./styles/index.css";

  const AdminLayout = lazy(() => import("./app/admin/AdminLayout.tsx"));
  const BlogPostPage = lazy(() => import("./app/blog/BlogPostPage.tsx"));
  const BlogListPage = lazy(() => import("./app/blog/BlogListPage.tsx"));
  const ProjectsPage = lazy(() => import("./app/projects/ProjectsPage.tsx"));
  const ProjectDetailPage = lazy(() => import("./app/projects/ProjectDetailPage.tsx"));

const LoadingScreen = () => (
  <div style={{ background: "var(--pf-bg)", color: "var(--pf-fg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
    Loading…
  </div>
);

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  return null;
};

// Restore deep-link route captured by public/404.html on GitHub Pages.
const redirectedPath = sessionStorage.getItem("spa-redirect");
if (redirectedPath) {
  sessionStorage.removeItem("spa-redirect");
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (redirectedPath !== currentPath) {
      window.history.replaceState(null, "", redirectedPath);
    }
  }

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <ScrollToTop />
    <ThemeProvider>
      <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/projects"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <ProjectsPage />
              </Suspense>
            }
          />
          <Route
            path="/projects/:slug"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <ProjectDetailPage />
              </Suspense>
            }
          />
          <Route
            path="/blog"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <BlogListPage />
              </Suspense>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <BlogPostPage />
              </Suspense>
            }
          />
          {import.meta.env.DEV && (
            <Route
              path="/admin/*"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <AdminLayout />
                </Suspense>
              }
            />
          )}
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );

  if (import.meta.env.PROD && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
        // Service worker registration failures should not block app startup.
      });
    });
  }
  
