import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

// Types
import type {
  UserRegisterType,
  UserLoginType,
} from "@/validations/user.validator";
import type { IUser } from "@/types/user.types";

interface AuthStore {
  user: IUser | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;

  registerUser: (userData: UserRegisterType) => Promise<IUser | null>;

  login: (userData: UserLoginType) => Promise<IUser | null>;

  checkAuth: () => Promise<void>;

  logout: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: false,

  registerUser: async (userData) => {
    set({ user: null, isAuthenticated: false });

    try {
      const response = axiosInstance.post("/v1/auth/register", userData);

      toast.promise(response, {
        loading: "Signing up...",
        success: "Signed up successfully",
        error: (err) => {
          return (
            err?.response?.data?.message || err.message || "Failed to sign up"
          );
        },
      });

      await response;

      set({ user: (await response).data.data, isAuthenticated: true });

      return (await response).data.data;
    } catch (error: any) {
      set({ user: null, isAuthenticated: false });

      throw new Error(error.message);
    }
  },

  login: async (userData) => {
    set({ user: null, isAuthenticated: false });

    try {
      const response = axiosInstance.post("/v1/auth/login", userData);

      toast.promise(response, {
        loading: "Logging in...",
        success: "Logged in successfully",
        error: (err) => {
          return (
            err?.response?.data?.message || err.message || "Failed to log in"
          );
        },
      });

      await response;

      set({ user: (await response).data.data, isAuthenticated: true });

      return (await response).data.data;
    } catch (error: any) {
      console.log(error.message);

      set({ user: null, isAuthenticated: false });

      throw new Error(error.message);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.post("/v1/auth/check-auth");

      set({
        user: res.data.data,
        isAuthenticated: !!res,
      });
    } catch (error) {
      set({ isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    set({ isAuthenticated: true });

    try {
      let response = axiosInstance.post("/v1/auth/logout");

      toast.promise(response, {
        loading: "Logging out...",
        success: "Logged out successfully",
        error: (err) => {
          return (
            err?.response?.data?.message ||
            err.message ||
            "Failed to logged out"
          );
        },
      });

      await response;

      set({ user: null, isAuthenticated: false });
    } catch (error) {
      set({ isAuthenticated: true });
    }
  },
}));

export default useAuthStore;
