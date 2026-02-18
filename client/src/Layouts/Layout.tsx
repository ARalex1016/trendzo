import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

// Components
import SidebarComponent from "@/components/SidebarComponent";
import Header from "@/components/Header";

const Layout = () => {
  const location = useLocation();

  // Scroll to top whenever route url changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-row w-screen min-h-svh">
      {/* Sidebar */}
      <SidebarComponent />

      {/* Right content area */}
      <div className="flex flex-col flex-1 min-h-screen relative">
        <Header />

        {/* Main */}
        <main className="flex-1 bg-background">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="shrink-0 h-12 bg-background border-t flex items-center justify-center text-sm">
          Footer
        </footer>
      </div>
    </div>
  );
};

export default Layout;
