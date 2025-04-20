import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

// Helper function for API requests with toast notifications
const handleAuthRequest = async (set, requestFn, successMessage, errorMessage) => {
  try {
    const res = await requestFn();
    toast.success(successMessage);
    return res;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || 'An unknown error occurred.';
    toast.error(errorMsg);
    return null;
  }
};

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  error: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
      toast.error("Failed to check authentication");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true, error: null });
    const res = await handleAuthRequest(set, async () => {
      return await axiosInstance.post("/auth/signup", data);
    }, "Account created successfully", "Failed to create account");

    if (res) {
      set({ authUser: res.data });
    }
    set({ isSigningUp: false });
  },

  login: async (data) => {
    set({ isLoggingIn: true, error: null });
    const res = await handleAuthRequest(set, async () => {
      return await axiosInstance.post("/auth/login", data);
    }, "Logged in successfully", "Failed to log in");

    if (res) {
      set({ authUser: res.data });
    }
    set({ isLoggingIn: false });
  },

  logout: async () => {
    set({ error: null });
    const res = await handleAuthRequest(set, async () => {
      return await axiosInstance.post("/auth/logout");
    }, "Logged out successfully", "Failed to log out");

    if (res) {
      set({ authUser: null });
    }
  },

}));
