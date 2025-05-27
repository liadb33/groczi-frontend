import { API_URL } from "./config";

// GET /promotions - get all promotions
export const fetchAllPromotions = async () => {
  const res = await fetch(`${API_URL}/promotions`);
  return res.json();
};

// GET /promotions/:promotionId/discounted-groceries?chainId=...&subChainId=...&storeId=...
export const fetchDiscountedGroceriesByPromotionId = async (
  promotionId: string,
  chainId: string,
  subChainId: string,
  storeId: string
) => {
  const url = new URL(
    `${API_URL}/promotions/${promotionId}/discounted-groceries`
  );
  url.searchParams.append("chainId", chainId);
  url.searchParams.append("subChainId", subChainId);
  url.searchParams.append("storeId", storeId);

  const res = await fetch(url.toString());
  return res.json();
};

// GET /promotions/store/:chainId/:subChainId/:storeId
export const fetchPromotionsByStore = async (
  chainId: string,
  subChainId: string,
  storeId: string
) => {
  const res = await fetch(
    `${API_URL}/promotions/store/${chainId}/${subChainId}/${storeId}`
  );
  return res.json();
};

// GET /promotions/grocery/:itemCode
export const fetchPromotionsByGroceryItemCode = async (itemCode: string) => {
  const res = await fetch(`${API_URL}/promotions/grocery/${itemCode}`);
  return res.json();
};


// GET /promotions/grouped-by-store - fetch promotions grouped by store
export const fetchPromotionsGroupedByStore = async () => {
  const res = await fetch(`${API_URL}/promotions/grouped-by-store`);
  if (!res.ok) {
    throw new Error("Failed to fetch promotions grouped by store");
  }
  return res.json();
};