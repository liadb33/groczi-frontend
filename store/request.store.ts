import { createRequest, deleteRequest, getAllRequests } from "@/utils/api/requests";
import {create} from "zustand";
interface Request {
  id: number;
  itemId: string;
  deviceId: string;
  reqSubject: string;
  reqBody: string;
  reqStatus: string;
  createdAt: string;
}

interface RequestsStore {
  requests: Request[];
  loading: boolean;
  error: string | null;

  fetchAllRequests: () => Promise<void>;
  deleteRequest: (id: number) => Promise<void>;
  createRequest: (
    itemId: string,
    deviceId: string,
    reqSubject: string,
    reqBody: string
  ) => Promise<void>;
}

export const useRequestsStore = create<RequestsStore>((set, get) => ({
  requests: [],
  loading: false,
  error: null,

  fetchAllRequests: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllRequests();
      set({ requests: data, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch requests", loading: false });
    }
  },

  deleteRequest: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteRequest(id);
      set({
        requests: get().requests.filter((r) => r.id !== id),
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to delete request", loading: false });
    }
  },

  createRequest: async (itemId, deviceId, reqSubject, reqBody) => {
    set({ loading: true, error: null });
    try {
      const newRequest = await createRequest(itemId, deviceId, reqSubject, reqBody);
      set((state) => ({
        requests: [...state.requests, newRequest],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to create request", loading: false });
    }
  },

}));