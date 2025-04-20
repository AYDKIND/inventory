import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useSettingStore = create((set, get) => ({
  quality: [],
  agent: [],
  firm: [],
  transport: [],
  loading: false,
  error: null,

  // Fetching all the settings data in parallel
  fetchSettingsData: async () => {
    set({ loading: true, error: null });
    try {
      const [qualityRes, agentsRes, firmsRes, transportRes] = await Promise.all(
        [
          axiosInstance.get("/quality"),
          axiosInstance.get("/agent"),
          axiosInstance.get("/firm"),
          axiosInstance.get("/transport"),
        ]
      );

      set({
        quality: qualityRes.data,
        agent: agentsRes.data,
        firm: firmsRes.data,
        transport: transportRes.data,
      });
    } catch (error) {
      set({ error: error.message });
      toast.error(`Error fetching settings: ${error.message}`);
    } finally {
      set({ loading: false });
    }
  },

  // Adding a new entry
  addEntry: async (type, inputData) => {
    set({ error: null });
    try {
      const response = await axiosInstance.post(`/${type}`, inputData);
      set((state) => {
        const updatedData = [...state[type], response.data]; // Add new entry to array
        return { [type]: updatedData };
      });
      toast.success(`${type} added successfully!`); // Notify user about success
      return response.data;
    } catch (error) {
      set({ error: error.message });
      toast.error(`Error adding ${type}: ${error.message}`);
      throw error; // Re-throw error for further handling if needed
    }
  },

  // Deleting an entry
  deleteEntry: async (type, id) => {
    set({ error: null });
    try {
      const response = await axiosInstance.delete(`/${type}/${id}`);
      set((state) => {
        const updatedData = state[type].filter(item => item._id !== id); // Remove entry with matching ID
        return { [type]: updatedData };
      });
      toast.success(`${type} deleted successfully!`); // Notify user about success
      return response.data;
    } catch (error) {
      set({ error: error.message });
      toast.error(`Error deleting ${type}: ${error.message}`);
      throw error; // Re-throw error for further handling if needed
    }
  },

  // Editing an entry
  editEntry: async (type, id, updatedData) => {
    set({ error: null });
    try {
      const response = await axiosInstance.put(`/${type}/${id}`, updatedData);
      set((state) => {
        const updatedDataArray = state[type].map((item) =>
          item._id === id ? { ...item, ...updatedData } : item // Update specific item
        );
        return { [type]: updatedDataArray };
      });
      toast.success(`${type} updated successfully!`); // Notify user about success
      return response.data;
    } catch (error) {
      set({ error: error.message });
      toast.error(`Error updating ${type}: ${error.message}`);
      throw error; // Re-throw error for further handling if needed
    }
  },
}));
