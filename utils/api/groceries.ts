import { API_URL } from "./config";

// GET /groceries - with optional filters
export const fetchAllGroceries = async (params?: {
  minPrice?: number;
  maxPrice?: number;
  company?: string;
  page?: number;
  limit?: number;
}) => {
  const query = new URLSearchParams();

  if (params?.minPrice !== undefined)
    query.append("minPrice", params.minPrice.toString());
  if (params?.maxPrice !== undefined)
    query.append("maxPrice", params.maxPrice.toString());
  if (params?.company) query.append("company", params.company);
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());

  const res = await fetch(`${API_URL}/groceries?${query.toString()}`);
  return res.json();
};

// GET /groceries/search?q=term
export const searchGroceries = async (
  query: string,
  page: number = 1,
  limit: number = 10
) => {
  const url = new URL(`${API_URL}/groceries/search`);
  url.searchParams.append("q", query);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", limit.toString());

  const res = await fetch(url.toString());
  return res.json();
};


// GET /groceries/:itemCode
export const fetchGroceryByItemCode = async (itemCode: string) => {
  const res = await fetch(`${API_URL}/groceries/${itemCode}`);
  return res.json();
};

// GET /groceries/:id/stores
export const fetchStoresByGroceryItemCode = async (itemCode: string) => {
  const res = await fetch(`${API_URL}/groceries/${itemCode}/stores`);
  return res.json();
};

// GET /groceries/:itemCode/price-history
export const fetchGroceryPriceHistory = async (itemCode: string) => {
  const res = await fetch(`${API_URL}/groceries/${itemCode}/price-history`);
  return res.json();
};
