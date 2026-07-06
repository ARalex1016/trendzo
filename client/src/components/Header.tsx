import { useNavigate } from "react-router-dom";

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
import { Mail, User, LogOut } from "lucide-react";

// Utils
import { getInitials } from "@/utils/StringManager";

const Header = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

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

            <DropdownMenuContent className="bg-primary/5 backdrop-blur-lg p-3 mr-side-spacing">
              <DropdownMenuItem className="text-xs hover:bg-primary/40! transition-all duration-300 group">
                <Mail />

                <span>{user?.email}</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="hover:bg-primary/40! transition-all duration-300"
                onClick={() => navigate("/profile")}
              >
                <User />

                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut />

                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
