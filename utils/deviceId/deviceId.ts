// utils/deviceId.ts
let deviceId: string | null = null;

export const setDeviceId = (id: string) => {
  deviceId = id;
};

export const getDeviceId = () => {
  if (!deviceId) throw new Error("Device ID not initialized");
  return deviceId;
};
