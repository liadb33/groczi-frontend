import { API_URL } from "./config";
import { getDeviceId } from "@/utils/deviceId/deviceId";

// GET /me/bookmarks
export const fetchBookmarks = async () => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/bookmarks`, {
    headers: {
      "X-Device-ID": deviceId,
    },
  });

  return res.json();
};

// POST /me/bookmarks
export const addBookmark = async (itemCode: string) => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/bookmarks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Device-ID": deviceId,
    },
    body: JSON.stringify({ itemCode }),
  });

  return res.json();
};

// DELETE /me/bookmarks/:itemCode
export const removeBookmark = async (itemCode: string) => {
  const deviceId = getDeviceId();

  const res = await fetch(`${API_URL}/me/bookmarks/${itemCode}`, {
    method: "DELETE",
    headers: {
      "X-Device-ID": deviceId,
    },
  });

  return res.json();
};
