import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const usePendingStore = create((set, get) => ({
  pendingOrders: [], // Ensure it starts as an empty array
  loading: false,
  error: null,

  getPendingOrders: async () => {
    set({ loading: true, error: null });

    try {
      const orderRes = await axiosInstance.get("/order/pending");
      set({ pendingOrders: orderRes.data });
    } catch (error) {
      set({ error: error.message });
      console.log(error)
      toast.error(`Failed to fetch orders: ${error.message}`);
    } finally {
      set({ loading: false }); // Don't reset the error in finally
    }
  },
}));