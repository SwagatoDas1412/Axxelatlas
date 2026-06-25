import apiClient from "./client";

export async function createProduct(payload) {
  const response = await apiClient.post("/admin/products", payload);
  return response.data;
}

export async function updateProduct(productId, payload) {
  const response = await apiClient.put(`/admin/products/${productId}`, payload);
  return response.data;
}

export async function getAdminRequests() {
  const response = await apiClient.get("/admin/requests");
  return response.data;
}

export async function updateAdminRequest(requestId, payload) {
  const response = await apiClient.put(`/admin/requests/${requestId}`, payload);
  return response.data;
}

export async function createDataAvailability(productId, payload) {
  const response = await apiClient.post(
    `/admin/products/${productId}/data-availability`,
    payload
  );
  return response.data;
}

export async function updateDataAvailability(availabilityId, payload) {
  const response = await apiClient.put(
    `/admin/data-availability/${availabilityId}`,
    payload
  );
  return response.data;
}

export async function createProductLink(productId, payload) {
  const response = await apiClient.post(
    `/admin/products/${productId}/links`,
    payload
  );
  return response.data;
}

export async function updateProductLink(linkId, payload) {
  const response = await apiClient.put(`/admin/product-links/${linkId}`, payload);
  return response.data;
}

export async function createContinuousSeriesRule(productId, payload) {
  const response = await apiClient.post(
    `/admin/products/${productId}/continuous-series-rules`,
    payload
  );
  return response.data;
}

export async function updateContinuousSeriesRule(ruleId, payload) {
  const response = await apiClient.put(
    `/admin/continuous-series-rules/${ruleId}`,
    payload
  );
  return response.data;
}

export async function createContractStatus(productId, payload) {
  const response = await apiClient.post(
    `/admin/products/${productId}/contract-status`,
    payload
  );
  return response.data;
}

export async function updateContractStatus(contractStatusId, payload) {
  const response = await apiClient.put(
    `/admin/contract-status/${contractStatusId}`,
    payload
  );
  return response.data;
}

export async function deleteDataAvailability(availabilityId) {
  const response = await apiClient.delete(
    `/admin/data-availability/${availabilityId}`
  );
  return response.data;
}

export async function deleteProductLink(linkId) {
  const response = await apiClient.delete(`/admin/product-links/${linkId}`);
  return response.data;
}

export async function deleteContinuousSeriesRule(ruleId) {
  const response = await apiClient.delete(
    `/admin/continuous-series-rules/${ruleId}`
  );
  return response.data;
}