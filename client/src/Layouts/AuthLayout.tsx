import { Outlet } from "react-router-dom";

// Components
import SidebarComponent from "@/components/SidebarComponent";
import Header from "@/components/Header";

const AuthLayout = () => {
  return (
    <div className="flex flex-row w-screen min-h-svh">
      {/* Sidebar */}
      <SidebarComponent />

      {/* Right content area */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Header */}
        <Header/>

        {/* Main */}
        <main className="flex-1 bg-background overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
