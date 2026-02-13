import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Components
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  // SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuButton,
  useSidebar,
} from "./ui/sidebar";

// Hooks
import { useIsMobile } from "@/hooks/use-mobile";

// Images
import LogoIcon from "@/assets/Images/trendzo-logo.png";

// Icons
import { Home, X, Package, LogIn, UserPlus } from "lucide-react";

// Menu Items
const items = [
  {
    title: "Home",
    url: "/#",
    icon: Home,
  },
  {
    title: "Products",
    url: "products",
    icon: Package,
  },
  {
    title: "Sign up",
    url: "signup",
    icon: UserPlus,
  },
  {
    title: "Log in",
    url: "login",
    icon: LogIn,
  },
];

const SidebarComponent = () => {
  const isMobile = useIsMobile();
  const { toggleSidebar, state } = useSidebar();
  const location = useLocation(); // Track route changes

  // Close sidebar whenever route changes
  useEffect(() => {
    if (isMobile) {
      // toggleSidebar();
    }
  }, [location.pathname]);

  return (
    <Sidebar side="left" variant="inset" collapsible="icon" className="p-0">
      <SidebarHeader className="h-menu-height flex flex-row items-center justify-between px-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-x-2">
          {/* Logo */}
          <img src={LogoIcon} alt="Logo" className="size-7 rounded-full" />

          {/* Brand Name */}
          <AnimatePresence>
            {state == "expanded" && (
              <motion.span
                variants={{
                  initial: {
                    width: 0,
                    opacity: 0,
                  },
                  animate: {
                    width: "auto",
                    opacity: 1,
                  },
                }}
                initial="initial"
                animate="animate"
                exit="initial"
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
                className="font-semibold text-xl inline-block overflow-hidden whitespace-nowrap"
              >
                Trendzo
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile close button  */}
        <button
          onClick={() => toggleSidebar()}
          aria-label="Close sidebar"
          className="md:hidden rounded-md p-1 hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};

export default SidebarComponent;
