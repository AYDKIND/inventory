import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

// Helper function to handle API requests
const handleApiRequest = async (set, requestFn, successToastMessage, errorToastMessage) => {
  set({ loading: true, error: null });
  try {
    const res = await requestFn();
    if (successToastMessage) toast.success(successToastMessage);
    return res;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
    set({ error: errorMessage });
    if (errorToastMessage) toast.error(errorMessage||errorToastMessage);
    return null;
  } finally {
    set({ loading: false });
  }
};

export const useDispatchStore = create((set) => ({
  pendingOrders: [],
  dispatchedOrders: [],
  pendingOrdersOfSelectedQualityId: [],
  pendingOrdersOfSelectedFirmId: [],
  weeklyDispatchSummary: [],
  selectedOrder: null,
  loading: false,
  error: null,

  // Get pending orders
  getPendingOrders: async () => {
    await handleApiRequest(set, async () => {
      const orderRes = await axiosInstance.get("/order/pending");
      set({ pendingOrders: orderRes.data });
    }, null, "Failed to fetch pending orders");
  },

  // Get pending order by ID
  getPendingOrderById: async (id) => {
    await handleApiRequest(set, async () => {
      const orderRes = await axiosInstance.get(`/order/${id}`);
      set({ selectedOrder: orderRes.data });
    }, null, "Failed to fetch order details");
  },

  // Get dispatched orders
  getDispatchedOrders: async () => {
    await handleApiRequest(set, async () => {
      const orderRes = await axiosInstance.get("/order/dispatched");
      set({ dispatchedOrders: orderRes.data });
    }, null, "Failed to fetch dispatched orders");
  },

  // Get pending orders for a selected quality ID
  getPendingOrdersOfSelectedQualityId: async (Id) => {
    await handleApiRequest(set, async () => {
      const orderRes = await axiosInstance.get(`/order/quality/pending/${Id}`);
      set({ pendingOrdersOfSelectedQualityId: orderRes.data });
    }, null, "Failed to fetch pending orders for the selected quality");
  },

  // Get pending orders for a selected firm ID
  getPendingOrdersOfSelectedFirmId: async (Id) => {
    await handleApiRequest(set, async () => {
      const orderRes = await axiosInstance.get(`/order/firm/pending/${Id}`);
      set({ pendingOrdersOfSelectedFirmId: orderRes.data });
    }, null, "Failed to fetch pending orders for the selected firm");
  },

  // Dispatch an order
  dispatchOrder: async (Id, dispatchData) => {
    await handleApiRequest(set, async () => {
      const orderRes = await axiosInstance.patch(`/order/dispatch/${Id}`, dispatchData);
    }, "Order successfully dispatched", "Not enough Quantities in stock");
  },

  // Get weekly dispatch summary
  getWeeklyDispatchSummary: async () => {
    await handleApiRequest(set, async () => {
      const Res = await axiosInstance.get(`/order/dispatch-summary`);
      set({ weeklyDispatchSummary: Res.data });
    }, null, "Failed to fetch dispatch summary");
  }

}));
