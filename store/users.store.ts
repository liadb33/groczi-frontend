import { create } from "zustand";
import { loginUser } from "@/utils/api/users";

interface User {
  id: number;
  username: string;
}

interface UsersStore {
  loading: boolean;
  error: string | null;
  loginUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useUsersStore = create<UsersStore>((set) => ({
  loginUser: null,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loginUser:null,loading: true, error: null });
    try {
      const res = await loginUser(username, password);
      if(res.status === 200) 
        set({loginUser:res.userId });
      else 
        set({ loginUser:null,error: "Invalid username or password"});
    } catch (error: any) {
      set({ loginUser:null,error: error.message || "Login failed",});
    } finally {
      set({ loading: false });
    }
  },

  logout: () => set({ loginUser: null }),
}));