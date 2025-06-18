import { API_URL } from "./config";


export const getAllRequests = async () => {
  const res = await fetch(`${API_URL}/requests`);
  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json();
};

export const deleteRequest = async (id: number) => {
  const res = await fetch(`${API_URL}/requests/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete request");
  return res.json();
};

export const createRequest = async (
  itemId: string,
  deviceId: string,
  reqSubject: string,
  reqBody: string
) => {
  const res = await fetch(`${API_URL}/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, deviceId, reqSubject, reqBody }),
  });
  if (!res.ok) throw new Error("Failed to create request");
  return res.json();
};

export const updateRequestStatus = async (id: number, status: string) => {
  
  const res = await fetch(`${API_URL}/requests/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestStatus: status }),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.log("Error response body:", errorText);
    throw new Error(`Failed to update request status: ${res.status} - ${errorText}`);
  }
  return res.json();
};