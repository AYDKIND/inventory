import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const handleApiRequest = async (set, requestFn, successToastMessage, errorToastMessage) => {
  set({ loading: true, error: null });
  try {
    const res = await requestFn();
    if (successToastMessage) toast.success(successToastMessage);
    return res;
  } catch (error) {
    set({ error: error.message });
    if (errorToastMessage) toast.error(`${errorToastMessage}: ${error.message}`);
    return null;
  } finally {
    set({ loading: false });
  }
};

export const useOrderStore = create((set, get) => ({
  quality: [],
  agent: [],
  firm: [],
  transport: [],
  pendingOrders: [],
  selectedOrder: [],
  allOrders: [],
  loading: false,
  error: null,

  // Fetching order-related data
  fetchOrderData: async () => {
    await handleApiRequest(set, async () => {
      const [qualityRes, agentsRes, firmsRes, transportRes] = await Promise.all([
        axiosInstance.get("/quality"),
        axiosInstance.get("/agent"),
        axiosInstance.get("/firm"),
        axiosInstance.get("/transport"),
      ]);
      set({
        quality: qualityRes.data,
        agent: agentsRes.data,
        firm: firmsRes.data,
        transport: transportRes.data,
      });
    });
  },

  fetchAgents: async () => {
    await handleApiRequest(set, async () => {
      const agentsRes = await axiosInstance.get("/agent");
      set({ agent: agentsRes.data });
    });
  },

  fetchQuality: async () => {
    await handleApiRequest(set, async () => {
      const qualityRes = await axiosInstance.get("/quality");
      set({ quality: qualityRes.data });
    });
  },

  fetchFirms: async (agentId) => {
    if (!agentId) {
      set({ firms: [], transports: [] });
      return;
    }
    await handleApiRequest(set, async () => {
      const res = await axiosInstance.get(`/api/firms/${agentId}`);
      set({ firms: res.data, transports: [] });
    });
  },

  fetchTransports: async (firmId) => {
    if (!firmId) {
      set({ transports: [] });
      return;
    }
    await handleApiRequest(set, async () => {
      const res = await axiosInstance.get(`/api/transports/${firmId}`);
      set({ transports: res.data });
    });
  },

  // Creating an order
  createOrder: async (orderData) => {
    await handleApiRequest(set, async () => {
      const res = await axiosInstance.post("/order", orderData);
      return res;
    }, "Order created successfully", "Failed to create order");
  },

  // Fetching pending orders
  getPendingOrders: async () => {
    await handleApiRequest(set, async () => {
      const orderRes = await axiosInstance.get("/order/pending");
      set({ pendingOrders: orderRes.data });
    }, null, "Failed to fetch pending orders");
  },

  // Fetching all orders
  getAllOrders: async () => {
    await handleApiRequest(set, async () => {
      const orderRes = await axiosInstance.get("/order");
      set({ allOrders: orderRes.data });
    }, null, "Failed to fetch all orders");
  },

  // Fetching a specific pending order by ID
  getPendingOrderById: async (id) => {
    return await handleApiRequest(set, async () => {
      const orderRes = await axiosInstance.get(`/order/${id}`);
      set({ selectedOrder: orderRes.data });
      return orderRes.data;
    }, null, "Failed to fetch order by ID");
  },

  // Updating an order
  updateOrder: async (id, formData) => {
    return await handleApiRequest(set, async () => {
      const orderRes = await axiosInstance.patch(`/order/update/${id}`, formData);
      set({ selectedOrder: orderRes.data });
      return orderRes.data;
    }, "Order updated successfully", "Failed to update order");
  },
}));
