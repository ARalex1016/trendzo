// Components
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeTrigger from "./ThemeTrigger";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CartButton } from "./CartButtons";

// Store
import useAuthStore from "@/store/useAuthStore";

// Icons
import { User, LogOut } from "lucide-react";

// Utils
import { getInitials } from "@/utils/StringManager";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="h-menu-height shrink-0 bg-background/80 flex items-center justify-between px-side-spacing border-b backdrop-blur-md sticky top-0 z-50">
      {/* Left */}
      <div className="flex items-center">
        <SidebarTrigger />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <CartButton />

        <ThemeTrigger />

        {/* Profile */}
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  // src={user?.}
                  alt="@shadcn"
                  className="grayscale"
                />
                <AvatarFallback>
                  {user?.name && getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem>
                <User />
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive" onClick={logout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
