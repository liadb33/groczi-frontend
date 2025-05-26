import { API_URL } from "./config";

/**
 * POST /optimization/single-store
 */
export async function optimizeSingleStoreList(
  body: OptimizeSingleStoreListRequestBody
): Promise<RankedStoresOptimizationResult> {
  const response = await fetch(`${API_URL}/optimize/single-store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  

  if (!response.ok) {
    // You can improve error handling as needed (e.g. show error to user)
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to optimize for single store");
  }

  return await response.json();
}

/**
 * POST /optimization/multi-store
 */
export async function optimizeMultiStoreList(
  body: OptimizeMultiStoreListRequestBody
): Promise<TopMultiStoreSolutionsResult> {
  const response = await fetch(`${API_URL}/optimize/multi-store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to optimize for multi-store");
  }

  return await response.json();
}
