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
      if(res && res.id) {
        set({loginUser: res });
      } else if(res && res.userId) {
        set({loginUser: { id: res.userId, username: res.username || username } });
      } else if(res && res.user) {
        set({loginUser: res.user });
      } else {
        set({ loginUser:null,error: "Invalid username or password"});
      }
    } catch (error: any) {
      console.log("Login error:", error);
      set({ loginUser:null,error: error.message || "Login failed",});
    } finally {
      set({ loading: false });
    }
  },

  logout: () => set({ loginUser: null }),
}));