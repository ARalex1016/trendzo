import { useEffect } from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";

// Components
import SidebarComponent from "@/components/SidebarComponent";
import Header from "@/components/Header";

interface LayoutProps {
  showFooter?: boolean;
}

const Layout = ({ showFooter = true }: LayoutProps) => {
  const location = useLocation();
  const [params] = useSearchParams();

  // If have referral, set to localStorage
  useEffect(() => {
    const ref = params.get("ref");

    if (ref && !localStorage.getItem("ref")) {
      localStorage.setItem("ref", ref);
    }
  }, [params]);

  // Scroll to top whenever route url changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-row w-screen overflow-hidden min-h-svh">
      {/* Sidebar */}
      <SidebarComponent />

      {/* Right content area */}
      <div className="flex flex-col flex-1 min-h-screen min-w-0 relative">
        <Header />

        {/* Main */}
        <main className="w-full flex-1 bg-background ">
          <Outlet />
        </main>

        {/* Footer */}
        {showFooter && (
          <footer className="shrink-0 h-12 bg-background border-t flex items-center justify-center text-sm">
            Footer
          </footer>
        )}
      </div>
    </div>
  );
};

export default Layout;
