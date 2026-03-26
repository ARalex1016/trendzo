import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import LogoIcon from "@/assets/Images/trendzo-logo.png";

import useAuthStore from "@/store/useAuthStore";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Home,
  Package,
  UserPlus,
  LogIn,
  ClipboardList,
  Store,
  Boxes,
  PlusCircle,
  Users,
} from "lucide-react";

// =========================
// Types
// =========================
import type { Role } from "@/types/user.types";

type UserRole = Role | "guest";

type BaseMenuItem = {
  title: string;
  icon?: LucideIcon;
  roles?: UserRole[];
};

type MenuChildItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
};

type LinkMenuItem = BaseMenuItem & {
  url: string;
  children?: never;
};

type ParentMenuItem = BaseMenuItem & {
  children: MenuChildItem[];
  url?: never;
};

type MenuItem = LinkMenuItem | ParentMenuItem;

type MenuGroup = {
  groupTitle: string;
  roles: UserRole[];
  items: MenuItem[];
};

type SidebarLogoProps = {
  state: "expanded" | "collapsed";
};

type SidebarMobileCloseButtonProps = {
  onClose: () => void;
};

type SidebarGroupSectionProps = {
  group: MenuGroup;
  pathname: string;
};

type SidebarLinkItemProps = {
  item: LinkMenuItem;
  pathname: string;
};

type SidebarParentItemProps = {
  item: ParentMenuItem;
  pathname: string;
};

// =========================
// Menu Config
// =========================
const menuItemsList: MenuGroup[] = [
  {
    groupTitle: "Main",
    roles: ["guest", "customer", "admin"],
    items: [
      { title: "Home", url: "/", icon: Home },
      { title: "Products", url: "/products", icon: Package },
      { title: "Sign up", url: "/signup", icon: UserPlus, roles: ["guest"] },
      { title: "Log in", url: "/login", icon: LogIn, roles: ["guest"] },
      {
        title: "Orders",
        url: "/orders",
        icon: ClipboardList,
        roles: ["customer"],
      },
    ],
  },
  {
    groupTitle: "Admin",
    roles: ["admin"],
    items: [
      {
        title: "Product Management",
        icon: Store,
        children: [
          {
            title: "All Products",
            url: "/products-management/all",
            icon: Boxes,
          },
          {
            title: "Add Product",
            url: "/products-management/add",
            icon: PlusCircle,
          },
        ],
      },
      {
        title: "User Management",
        url: "/users-management",
        icon: Users,
      },
    ],
  },
];

// =========================
// Type Guards
// =========================
const isParentMenuItem = (item: MenuItem): item is ParentMenuItem => {
  return "children" in item && Array.isArray(item.children);
};

const isLinkMenuItem = (item: MenuItem): item is LinkMenuItem => {
  return "url" in item && typeof item.url === "string";
};

// =========================
// Helpers
// =========================
const isItemAllowedForRole = (item: MenuItem, role: UserRole): boolean => {
  if (!item.roles) return true;
  return item.roles.includes(role);
};

const isPathActive = (pathname: string, url: string): boolean => {
  if (url === "/") return pathname === "/";
  return pathname === url || pathname.startsWith(`${url}/`);
};

const getFilteredMenuGroups = (
  groups: MenuGroup[],
  currentRole: UserRole,
): MenuGroup[] => {
  return groups
    .filter((group) => group.roles.includes(currentRole))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        isItemAllowedForRole(item, currentRole),
      ),
    }))
    .filter((group) => group.items.length > 0);
};

// =========================
// Small Components
// =========================
const SidebarLogo = ({ state }: SidebarLogoProps) => {
  return (
    <div className="flex items-center gap-x-2 min-w-0">
      <img
        src={LogoIcon}
        alt="Trendzo Logo"
        className="size-8 rounded-full object-cover shrink-0"
      />

      <AnimatePresence initial={false}>
        {state === "expanded" && (
          <motion.span
            variants={{
              initial: { width: 0, opacity: 0 },
              animate: { width: "auto", opacity: 1 },
              exit: { width: 0, opacity: 0 },
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="font-semibold text-lg inline-block overflow-hidden whitespace-nowrap"
          >
            Rukshana Trends
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarMobileCloseButton = ({
  onClose,
}: SidebarMobileCloseButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close sidebar"
      className="md:hidden rounded-md p-1 hover:bg-muted transition-colors"
    >
      <X className="h-5 w-5" />
    </button>
  );
};

const SidebarLinkItem = ({ item, pathname }: SidebarLinkItemProps) => {
  const active = isPathActive(pathname, item.url);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        className={`rounded-md transition-colors ${
          active ? "bg-muted text-primary font-medium" : "hover:bg-muted/60"
        }`}
      >
        <Link to={item.url} className="flex items-center gap-x-2">
          {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
          <span className="text-base">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarChildLinkItem = ({
  child,
  pathname,
}: {
  child: MenuChildItem;
  pathname: string;
}) => {
  const active = isPathActive(pathname, child.url);

  return (
    <SidebarMenuItem key={child.title}>
      <SidebarMenuButton
        asChild
        className={`rounded-md transition-colors ${
          active ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"
        }`}
      >
        <Link to={child.url} className="flex items-center gap-x-2">
          {child.icon && <child.icon className="h-4 w-4 shrink-0" />}
          <span className="text-sm">{child.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarParentItem = ({ item, pathname }: SidebarParentItemProps) => {
  const isChildActive = item.children.some((child) =>
    isPathActive(pathname, child.url),
  );

  return (
    <SidebarMenuItem>
      <Collapsible defaultOpen={isChildActive}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className={`flex w-full items-center justify-between rounded-md transition-colors ${
              isChildActive ? "bg-muted font-medium" : "hover:bg-muted/60"
            }`}
          >
            <div className="flex items-center gap-x-2">
              {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
              <span>{item.title}</span>
            </div>

            <ChevronDown className="h-4 w-4 shrink-0 transition-transform data-[state=open]:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenu className="mt-1 flex flex-col gap-y-1 pl-6">
            {item.children.map((child) => (
              <SidebarChildLinkItem
                key={child.title}
                child={child}
                pathname={pathname}
              />
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

const SidebarMenuRenderer = ({
  items,
  pathname,
}: {
  items: MenuItem[];
  pathname: string;
}) => {
  return (
    <SidebarMenu className="flex flex-col gap-y-1">
      {items.map((item) => {
        if (isParentMenuItem(item)) {
          return (
            <SidebarParentItem
              key={item.title}
              item={item}
              pathname={pathname}
            />
          );
        }

        if (isLinkMenuItem(item)) {
          return (
            <SidebarLinkItem key={item.title} item={item} pathname={pathname} />
          );
        }

        return null;
      })}
    </SidebarMenu>
  );
};

const SidebarGroupSection = ({ group, pathname }: SidebarGroupSectionProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{group.groupTitle}</SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenuRenderer items={group.items} pathname={pathname} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

// =========================
// Main Component
// =========================
const SidebarComponent = () => {
  const isMobile = useIsMobile();
  const { toggleSidebar, state } = useSidebar();
  const location = useLocation();

  const { user } = useAuthStore();
  const currentRole: UserRole = user?.role ?? "guest";

  const menuItems = useMemo(() => {
    return getFilteredMenuGroups(menuItemsList, currentRole);
  }, [currentRole]);

  useEffect(() => {
    if (isMobile) {
      // Uncomment if you want sidebar to auto-close on route change
      // toggleSidebar();
    }
  }, [location.pathname, isMobile, toggleSidebar]);

  return (
    <Sidebar
      side="left"
      variant="inset"
      collapsible="icon"
      className="p-0 border-r"
    >
      <SidebarHeader className="h-menu-height flex flex-row items-center justify-between px-4 border-b">
        <SidebarLogo state={state} />
        <SidebarMobileCloseButton onClose={toggleSidebar} />
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroupSection
            key={group.groupTitle}
            group={group}
            pathname={location.pathname}
          />
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t" />
    </Sidebar>
  );
};

export default SidebarComponent;
