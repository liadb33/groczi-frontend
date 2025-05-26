import { API_URL } from "./config";

// GET /stores - fetch all stores
export const fetchAllStores = async () => {
  const res = await fetch(`${API_URL}/stores`);
  return res.json();
};

// GET /stores/:id - fetch a specific store by ID
export const fetchStoreById = async (id: string) => {
  const res = await fetch(`${API_URL}/stores/${id}`);
  return res.json();
};
