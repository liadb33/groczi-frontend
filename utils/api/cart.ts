import { API_URL } from "./config";
import { getDeviceId } from "@/utils/deviceId/deviceId";

// GET /me/cart
export const fetchCart = async () => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/cart`, {
    headers: {
      "X-Device-ID": deviceId,
    },
  });

   if (!res.ok) {
     const text = await res.text();
     console.error("Fetch failed with status", res.status);
     console.error("Response text:", text);
   }

  return res.json();
};

// POST /me/cart/items
export const addCartItem = async (itemCode: string, quantity: number) => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Device-ID": deviceId,
    },
    body: JSON.stringify({ itemCode, quantity }),
  });

  return res.json();
};

// PUT /me/cart/items/:itemCode
export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number
) => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/cart/items/${cartItemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Device-ID": deviceId,
    },
    body: JSON.stringify({ quantity }),
  });

  return res.json();
};

// DELETE /me/cart/items/:itemCode
export const removeCartItem = async (cartItemId: string) => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/cart/items/${cartItemId}`, {
    method: "DELETE",
    headers: {
      "X-Device-ID": deviceId,
    },
  });

  return res.json();
};


// POST /me/cart/optimize-single-store
export const optimizeSingleStoreCart = async (params: {
  userLatitude: number;
  userLongitude: number;
  costPerDistanceUnit?: number;
  lambdaTravel?: number;
  maxStoreDistance?: number;
}) => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/cart/optimize-single-store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Device-ID": deviceId,
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Optimize single-store cart failed with status", res.status);
    console.error("Response text:", text);
    throw new Error(`Optimize single-store cart failed: ${text}`);
  }

  return res.json();
};

// POST /me/cart/optimize-multi-store
export const optimizeMultiStoreCart = async (params: {
  userLatitude: number;
  userLongitude: number;
  costPerDistanceUnit?: number;
  lambdaTravel?: number;
  maxStores?: number;
  maxTravelDistance?: number;
  maxStoreDistance?: number;
}) => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/cart/optimize-multi-store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Device-ID": deviceId,
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Optimize multi-store cart failed with status", res.status);
    console.error("Response text:", text);
    throw new Error(`Optimize multi-store cart failed: ${text}`);
  }

  return res.json();
};

