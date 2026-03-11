import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";

// Components
import { ThemeProvider } from "./components/theme-provider";
import { SidebarProvider } from "./components/ui/sidebar";

// Hooks
// import { useAppInit } from "./hooks/useAppInit";
import useAuthStore from "./store/useAuthStore";

function App() {
  // const { loading } = useAppInit();

  // if (loading) {
  //   return <main className="w-svw h-svh bg-yellow-400"></main>;
  // }

  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider>
          <RouterProvider router={router} />
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
