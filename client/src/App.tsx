import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";

// Components
import { ThemeProvider } from "./components/theme-provider";
import { SidebarProvider } from "./components/ui/sidebar";

// Store
import useAuthStore from "./store/useAuthStore";

function App() {
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
