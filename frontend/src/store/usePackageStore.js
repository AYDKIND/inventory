import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const usePackageStore = create((set, get) => ({
  quality: [],
  lastProduced: [],
  loading: false,
  error: null,

  // Fetching quality data
  getQuality: async () => {
    set({ loading: true, error: null });
    try {
      const qualityRes = await axiosInstance.get("/quality");
      set((state) => ({
        quality: [...qualityRes.data], // Spread the data to avoid direct mutation
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
      set({ error: errorMessage });
      toast.error(`Error fetching quality: ${errorMessage}`); // Toast notification on error
    } finally {
      set({ loading: false });
    }
  },

  // Creating a new package
  newPackage: async (qualityId, quantity) => {
    set({ error: null });
    try {
      const response = await axiosInstance.patch(`/quality/${qualityId}`, { quantity });
      toast.success("New package created successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
      set({ error: errorMessage });
      toast.error(`Error creating package: ${errorMessage}`); // Toast notification on error
      return null;
    }
  },

  // Fetching the last produced data
  getLastProduced: async () => {
    set({ error: null });
    try {
      const Res = await axiosInstance.get(`/quality/last-produced`);
      set({ lastProduced: Res.data });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
      set({ error: errorMessage });
      toast.error(`Error fetching last produced data: ${errorMessage}`); // Toast notification on error
      return null;
    }
  }
}));
