import { useState } from "react";

// Components
import { Container } from "./PageComponents";

// Store
import useAuthStore from "@/store/useAuthStore";

// Icons
import { LogOut, Loader } from "lucide-react";

const LogoutCard = () => {
  const { logout } = useAuthStore();

  const [loading, setLoading] = useState(false);

  const logoutAccount = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="flex flex-col items-center text-center px-6 py-6 sm:py-12">
        <div className="size-12 bg-accent/60 rounded-xl flex items-center justify-center border border-border mb-5">
          <LogOut size={20} className="text-foreground/32" />
        </div>

        <h2 className="text-sm font-semibold text-foreground mb-1.5">
          Sign Out
        </h2>

        <p className="text-xs text-foreground/35 max-w-60 leading-relaxed mb-7">
          Signing out will securely end your current session.
        </p>

        <button
          disabled={loading}
          onClick={logoutAccount}
          className="text-foreground/60 font-medium bg-accent/60 border border-border rounded-xl flex flex-row items-center gap-x-2 px-6 py-1.5 sm:px-8 sm:py-2 enabled:hover:text-foreground enabled:hover:bg-accent enabled:hover:border-foreground/20 transition-all duration-300 enabled:cursor-pointer disabled:cursor-not-allowed"
        >
          {!loading && <LogOut size={14} />}

          <span>{loading ? "Signing out…" : "Sign Out"}</span>

          {loading && <Loader size={14} className="animate-spin" />}
        </button>
      </div>
    </Container>
  );
};

export default LogoutCard;
