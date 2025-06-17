import { create } from "zustand";
import { loginUser } from "@/utils/api/users";

interface User {
  id: number;
  username: string;
}

interface UsersStore {
  loginUser: User | null;
  loading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useUsersStore = create<UsersStore>((set) => ({
  loginUser: null,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const user = await loginUser(username, password);
      set({ loginUser: user, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Login failed", loading: false });
    }
  },

  logout: () => set({ loginUser: null }),
}));