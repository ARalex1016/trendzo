import { useEffect, useState } from "react";

// Store
import useAuthStore from "@/store/useAuthStore";
import useAttributeStore from "@/store/useAttributeStore";

export const useAppInit = () => {
  const [loading, setLoading] = useState(true);

  const checkAuth = useAuthStore((state) => state.checkAuth);
  const getAttributes = useAttributeStore((state) => state.getAttributes);

  useEffect(() => {
    const initApp = async () => {
      try {
        await checkAuth();

        await getAttributes();

        // if (user) {
        //   await fetchCart();
        // }
      } catch (error) {
        console.error("App init failed:", error);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  return { loading };
};
