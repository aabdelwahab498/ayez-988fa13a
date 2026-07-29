/**
 * Placeholder API layer.
 * Each function currently resolves mock data. When the Django REST API is
 * ready, swap the body for a fetch against API_BASE_URL — signatures stay.
 */
export const API_BASE_URL = "/api/v1";

export async function mockRequest<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
