import { RouterProvider } from "react-router-dom";
import router from "./router/router";

// Components
import { ThemeProvider } from "./components/theme-provider";
import { SidebarProvider } from "./components/ui/sidebar";

// Hooks
import { useAppInit } from "./hooks/useAppInit";

function App() {
  const { loading } = useAppInit();

  if (loading) {
    return <main className="w-svw h-svh bg-yellow-400"></main>;
  }

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
