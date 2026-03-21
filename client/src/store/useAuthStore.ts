import { create } from "zustand";
import { axiosInstance } from "./axios";

// Types
import type {
  UserRegisterType,
  UserLoginType,
} from "@/validations/user.validator";
import type { IUser } from "@/types/user.types";

// Components
import Alert from "@/components/Alert";

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
      const response = await axiosInstance.post("/v1/auth/register", userData);

      Alert({
        title: "Successful",
        text: response?.data?.message || "Successfully signed up",
        icon: "success",
        confirmButtonText: "Ok",
      });

      set({ user: response.data.data, isAuthenticated: true });

      return response.data.data;
    } catch (error: any) {
      set({ user: null, isAuthenticated: false });

      Alert({
        title: "Error",
        text: error.response.data.message || "Something went wrong",
        icon: "error",
        confirmButtonText: "Retry",
      });

      throw new Error(error.message);
    }
  },

  login: async (userData) => {
    set({ user: null, isAuthenticated: false });

    try {
      const response = await axiosInstance.post("/v1/auth/login", userData);

      Alert({
        title: "Successful",
        text: response?.data?.message || "Logged in successful",
        icon: "success",
        confirmButtonText: "Ok",
      });

      set({ user: response.data.data, isAuthenticated: true });

      return response.data.data;
    } catch (error: any) {
      set({ user: null, isAuthenticated: false });

      Alert({
        title: "Error",
        text: error.response.data.message || "Something went wrong",
        icon: "error",
        confirmButtonText: "Retry",
      });

      throw new Error(error.message);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.post("/v1/auth/check-auth");

      set({
        user: res.data.data,
        isAuthenticated: true,
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
      await axiosInstance.post("/v1/auth/logout");

      Alert({
        title: "Logged out",
        text: "Logout successfully",
        icon: "error",
      });
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      set({ isAuthenticated: true });
    }
  },
}));

export default useAuthStore;
