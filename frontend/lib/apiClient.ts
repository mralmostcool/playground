// lib/apiClient.ts
// Simple wrapper around the backend OpenAPI endpoints.
// No authentication, no pagination – fetches full collections.
// Base URL is proxied via Nginx at /api

export const API_BASE = "/api";

// Helper for GET requests returning JSON
async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`);
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return (await res.json()) as T;
}

// Helper for POST/PUT/PATCH/DELETE with optional body
async function sendJson<T, B>(method: string, url: string, body?: B): Promise<T> {
  const opts: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  };
  const res = await fetch(`${API_BASE}${url}`, opts);
  if (!res.ok) throw new Error(`${method} ${url} failed: ${res.status}`);
  return (await res.json()) as T;
}

// Vessels
export type VesselRequestDTO = {
  imo: string;
  name: string;
  flag: string;
  isActive: boolean;
};
export type VesselResponseDTO = VesselRequestDTO & { id: string; createdAt: string; updatedAt: string };

export const getAllVessels = () => getJson<VesselResponseDTO[]>("/vessels");
export const getVessel = (id: string) => getJson<VesselResponseDTO>(`/vessels/${id}`);
export const createVessel = (data: VesselRequestDTO) => sendJson<VesselResponseDTO, VesselRequestDTO>("POST", "/vessels", data);
export const updateVessel = (id: string, data: VesselRequestDTO) => sendJson<VesselResponseDTO, VesselRequestDTO>("PUT", `/vessels/${id}`, data);
export const deleteVessel = (id: string) => sendJson<void, null>("DELETE", `/vessels/${id}`);

// Ranks
export type RankMasterRequestDTO = { name: string; level: number };
export type RankMasterResponseDTO = RankMasterRequestDTO & { id: string; createdAt: string };
export const getAllRanks = () => getJson<RankMasterResponseDTO[]>("/ranks");
export const getRank = (id: string) => getJson<RankMasterResponseDTO>(`/ranks/${id}`);
export const createRank = (data: RankMasterRequestDTO) => sendJson<RankMasterResponseDTO, RankMasterRequestDTO>("POST", "/ranks", data);
export const updateRank = (id: string, data: RankMasterRequestDTO) => sendJson<RankMasterResponseDTO, RankMasterRequestDTO>("PUT", `/ranks/${id}`, data);
export const deleteRank = (id: string) => sendJson<void, null>("DELETE", `/ranks/${id}`);

// Additional entity wrappers can be added following the same pattern.
