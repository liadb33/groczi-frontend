import { API_URL } from "./config";

/**
 * GET /categories
 * Fetch all available categories (from constant list)
 */
export const fetchAllCategories = async () => {
  const res = await fetch(`${API_URL}/groceries/categories/`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};


/**
 * GET /groceries/by-category?category=A|B&page=1&limit=10
 * Fetch groceries that belong to one or more categories
 */
export const fetchGroceriesByCategories = async (
  categories: string[],
  page: number = 1,
  limit: number = 10
) => {
  const query = new URLSearchParams();
  query.append("category", categories.join("|"));
  query.append("page", String(page));
  query.append("limit", String(limit));

  const res = await fetch(
    `${API_URL}/groceries/by-category?${query.toString()}`
  );
  if (!res.ok) throw new Error("Failed to fetch groceries by categories");
  return res.json();
};
/**
 * GET /groceries/categories/:category/count
 * Fetch grocery count for a specific category
 */
export const fetchGroceriesCountByCategory = async (category: string) => {
  const encodedCategory = encodeURIComponent(category);
  const res = await fetch(`${API_URL}/groceries/categories/${encodedCategory}/count`);
  if (!res.ok) throw new Error("Failed to fetch count for category");
  return res.json();
};