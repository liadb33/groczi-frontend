import { API_URL } from "./config";
import { getDeviceId } from "@/utils/deviceId/deviceId";

// GET /me/lists - fetch all lists
export const fetchLists = async () => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/lists`, {
    headers: {
      "X-Device-ID": deviceId,
    },
  });

  return res.json();
};

// POST /me/lists - create a new list
export const createList = async (name: string) => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/lists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Device-ID": deviceId,
    },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

// GET /me/lists/:listId - get list with its items
export const fetchListDetail = async (listId: string) => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/lists/${listId}`, {
    headers: {
      "X-Device-ID": deviceId,
    },
  });

  return res.json();
};

// PUT /me/lists/:listId - update list name
export const updateListName = async (listId: string, name: string) => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/lists/${listId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Device-ID": deviceId,
    },
    body: JSON.stringify({ name }),
  });

  return res.json();
};

// DELETE /me/lists - delete multiple lists
export const deleteLists = async (listIds: string[]) => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/lists`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-Device-ID": deviceId,
    },
    body: JSON.stringify({ listIds }),
  });

  return res.json();
};

// POST /me/lists/:listId/items - add item to list
export const addListItem = async (
  listId: string,
  itemCode: string,
  quantity: number
) => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/lists/${listId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Device-ID": deviceId,
    },
    body: JSON.stringify({ itemCode, quantity }),
  });

  return res.json();
};

// DELETE /me/lists/:listId/items/:itemCode - remove item from list
export const deleteListItem = async (listId: string, itemCode: string) => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/lists/${listId}/items/${itemCode}`, {
    method: "DELETE",
    headers: {
      "X-Device-ID": deviceId,
    },
  });

  return res.json();
};

// PATCH /me/lists/:listId/items/:itemCode - update quantity of item in list
export const updateListItemQuantity = async (
  listId: string,
  itemCode: string,
  quantity: number
) => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/lists/${listId}/items/${itemCode}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Device-ID": deviceId,
    },
    body: JSON.stringify({ quantity }),
  });

  return res.json();
};


