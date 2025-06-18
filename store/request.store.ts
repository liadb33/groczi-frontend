import { createRequest, deleteRequest, getAllRequests, updateRequestStatus } from "@/utils/api/requests";
import { create } from "zustand";
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
  success: boolean;
  fetchAllRequests: () => Promise<void>;
  deleteRequest: (id: number) => Promise<void>;
  createRequest: (
    itemId: string,
    deviceId: string,
    reqSubject: string,
    reqBody: string
  ) => Promise<void>;
  updateRequestStatus: (id: number, status: string) => Promise<void>;
}

export const useRequestsStore = create<RequestsStore>((set, get) => ({
  requests: [],
  loading: false,
  error: null,
  success: false,

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
    set({success: false, loading: true, error: null });
    try {
      const newRequest = await createRequest(itemId, deviceId, reqSubject, reqBody);
      if (newRequest.itemId) {
        set((state) => ({
          success: true,
          requests: [...state.requests, newRequest],
        }));
      } else {
        set({success: false,error: "Failed to create request"});
      }
    } catch (error: any) {
      set({ success: false,error: error.message || "Failed to create request" });
    } finally {
      set({ loading: false })
    }
  },
  updateRequestStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const res = await updateRequestStatus(id, status);
      if(!res.id) 
          set({ error: "Failed to update request status", loading: false });
      // TODO: update this
    } catch (error: any) {
      set({ error: error.message || "Failed to update request status", loading: false });
    } finally {
      set({ loading: false  });
    }
  },
}));