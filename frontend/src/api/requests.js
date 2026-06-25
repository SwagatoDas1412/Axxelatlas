import apiClient from "./client";

export async function createDataRequest(payload) {
  const response = await apiClient.post("/requests", payload);
  return response.data;
}

export async function getMyRequests() {
  const response = await apiClient.get("/requests/my");
  return response.data;
}