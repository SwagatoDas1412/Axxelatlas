import apiClient from "./client";

export async function getProducts(params = {}) {
  const response = await apiClient.get("/products", { params });
  return response.data;
}

export async function getProduct(productId) {
  const response = await apiClient.get(`/products/${productId}`);
  return response.data;
}

export async function getProductDataAvailability(productId) {
  const response = await apiClient.get(`/products/${productId}/data-availability`);
  return response.data;
}

export async function getProductLinks(productId) {
  const response = await apiClient.get(`/products/${productId}/links`);
  return response.data;
}

export async function getProductContinuousSeriesRule(productId) {
  const response = await apiClient.get(`/products/${productId}/continuous-series-rule`);
  return response.data;
}

export async function getProductContractStatus(productId) {
  const response = await apiClient.get(`/products/${productId}/contract-status`);
  return response.data;
}