// lib/apiClient.ts
// Lightweight wrapper around the backend OpenAPI endpoints.
// No authentication, no pagination – fetches full collections.
// Base URL is proxied via Nginx at /api

export const API_BASE = "/api";

// ── Helpers ──────────────────────────────────────────────────────────

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`);
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return (await res.json()) as T;
}

async function sendJson<T>(method: string, url: string, body?: unknown): Promise<T> {
  const opts: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  };
  const res = await fetch(`${API_BASE}${url}`, opts);
  if (method === "DELETE" && res.ok) return undefined as T;
  if (!res.ok) throw new Error(`${method} ${url} failed: ${res.status}`);
  return (await res.json()) as T;
}

// ── Vessels ──────────────────────────────────────────────────────────

export type VesselRequestDTO = {
  imo: string;
  name: string;
  flag: string;
  isActive: boolean;
};
export type VesselResponseDTO = VesselRequestDTO & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export const getAllVessels = () => getJson<VesselResponseDTO[]>("/vessels");
export const getVessel = (id: string) => getJson<VesselResponseDTO>(`/vessels/${id}`);
export const createVessel = (d: VesselRequestDTO) => sendJson<VesselResponseDTO>("POST", "/vessels", d);
export const updateVessel = (id: string, d: VesselRequestDTO) => sendJson<VesselResponseDTO>("PUT", `/vessels/${id}`, d);
export const deleteVessel = (id: string) => sendJson<void>("DELETE", `/vessels/${id}`);

// ── Ranks ────────────────────────────────────────────────────────────

export type RankMasterRequestDTO = { name: string; level: number };
export type RankMasterResponseDTO = RankMasterRequestDTO & {
  id: string;
  createdAt: string;
};

export const getAllRanks = () => getJson<RankMasterResponseDTO[]>("/ranks");
export const getRank = (id: string) => getJson<RankMasterResponseDTO>(`/ranks/${id}`);
export const createRank = (d: RankMasterRequestDTO) => sendJson<RankMasterResponseDTO>("POST", "/ranks", d);
export const updateRank = (id: string, d: RankMasterRequestDTO) => sendJson<RankMasterResponseDTO>("PUT", `/ranks/${id}`, d);
export const deleteRank = (id: string) => sendJson<void>("DELETE", `/ranks/${id}`);

// ── Pre-Sea Courses ──────────────────────────────────────────────────

export type PreSeaCoursesRequestDTO = {
  name: string;
  isActive: boolean;
  startDate: string; // date (YYYY-MM-DD)
  instituteId?: string;
};
export type PreSeaCoursesResponseDTO = PreSeaCoursesRequestDTO & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export const getAllCourses = () => getJson<PreSeaCoursesResponseDTO[]>("/pre-sea-courses");
export const getCourse = (id: string) => getJson<PreSeaCoursesResponseDTO>(`/pre-sea-courses/${id}`);
export const createCourse = (d: PreSeaCoursesRequestDTO) => sendJson<PreSeaCoursesResponseDTO>("POST", "/pre-sea-courses", d);
export const updateCourse = (id: string, d: PreSeaCoursesRequestDTO) => sendJson<PreSeaCoursesResponseDTO>("PUT", `/pre-sea-courses/${id}`, d);
export const deleteCourse = (id: string) => sendJson<void>("DELETE", `/pre-sea-courses/${id}`);

// ── Institutes ───────────────────────────────────────────────────────

export type InstituteRequestDTO = { name: string };
export type InstituteResponseDTO = InstituteRequestDTO & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export const getAllInstitutes = () => getJson<InstituteResponseDTO[]>("/institutes");
export const getInstitute = (id: string) => getJson<InstituteResponseDTO>(`/institutes/${id}`);
export const createInstitute = (d: InstituteRequestDTO) => sendJson<InstituteResponseDTO>("POST", "/institutes", d);
export const updateInstitute = (id: string, d: InstituteRequestDTO) => sendJson<InstituteResponseDTO>("PUT", `/institutes/${id}`, d);
export const deleteInstitute = (id: string) => sendJson<void>("DELETE", `/institutes/${id}`);

// ── Indos Master ─────────────────────────────────────────────────────

export type IndosMasterRequestDTO = {
  indos: string;
  firstName: string;
  rankId: string;
  isActive: boolean;
};
export type IndosMasterResponseDTO = IndosMasterRequestDTO & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export const getAllIndos = () => getJson<IndosMasterResponseDTO[]>("/indos");
export const getIndos = (id: string) => getJson<IndosMasterResponseDTO>(`/indos/${id}`);
export const createIndos = (d: IndosMasterRequestDTO) => sendJson<IndosMasterResponseDTO>("POST", "/indos", d);
export const updateIndos = (id: string, d: IndosMasterRequestDTO) => sendJson<IndosMasterResponseDTO>("PUT", `/indos/${id}`, d);
export const deleteIndos = (id: string) => sendJson<void>("DELETE", `/indos/${id}`);

// ── Enrollments ──────────────────────────────────────────────────────

export type EnrollmentRequestDTO = {
  preSeaCourseId: string;
  indosMasterId: string;
  status?: "ENROLLED" | "COMPLETED" | "CANCELLED";
  remarks?: string;
};
export type EnrollmentResponseDTO = {
  id: string;
  preSeaCourseId: string;
  indosMasterId: string;
  status: "ENROLLED" | "COMPLETED" | "CANCELLED";
  remarks?: string;
  createdAt: string;
  updatedAt: string;
};

export const getAllEnrollments = () => getJson<EnrollmentResponseDTO[]>("/enrollments");
export const getEnrollment = (id: string) => getJson<EnrollmentResponseDTO>(`/enrollments/${id}`);
export const createEnrollment = (d: EnrollmentRequestDTO) => sendJson<EnrollmentResponseDTO>("POST", "/enrollments", d);
export const updateEnrollment = (id: string, d: EnrollmentRequestDTO) => sendJson<EnrollmentResponseDTO>("PUT", `/enrollments/${id}`, d);
export const deleteEnrollment = (id: string) => sendJson<void>("DELETE", `/enrollments/${id}`);

// ── Contracts ────────────────────────────────────────────────────────

export type ContractRequestDTO = {
  indosMasterId: string;
  companyId: string;
  enrollmentId: string;
  berthSeafarerAllocationId: string;
  status?: "DRAFT" | "ACTIVE" | "COMPLETED" | "TERMINATED";
  signOnDate: string;
  signOnPort: string;
  signOnCountry: string;
  signOffDate: string;
  signOffPort: string;
  signOffCountry: string;
  actualSignOnDate?: string;
  actualSignOnPort?: string;
  actualSignOnCountry?: string;
  actualSignOffDate?: string;
  actualSignOffPort?: string;
  actualSignOffCountry?: string;
  remarks?: string;
};
export type ContractResponseDTO = ContractRequestDTO & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export const getAllContracts = () => getJson<ContractResponseDTO[]>("/contracts");
export const getContract = (id: string) => getJson<ContractResponseDTO>(`/contracts/${id}`);
export const createContract = (d: ContractRequestDTO) => sendJson<ContractResponseDTO>("POST", "/contracts", d);
export const updateContract = (id: string, d: ContractRequestDTO) => sendJson<ContractResponseDTO>("PUT", `/contracts/${id}`, d);
export const deleteContract = (id: string) => sendJson<void>("DELETE", `/contracts/${id}`);

// ── Companies ────────────────────────────────────────────────────────

export type CompanyRequestDTO = {
  name: string;
  registrationNo?: string;
  isActive: boolean;
};
export type CompanyResponseDTO = CompanyRequestDTO & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export const getAllCompanies = () => getJson<CompanyResponseDTO[]>("/companies");
export const getCompany = (id: string) => getJson<CompanyResponseDTO>(`/companies/${id}`);
export const createCompany = (d: CompanyRequestDTO) => sendJson<CompanyResponseDTO>("POST", "/companies", d);
export const updateCompany = (id: string, d: CompanyRequestDTO) => sendJson<CompanyResponseDTO>("PUT", `/companies/${id}`, d);
export const deleteCompany = (id: string) => sendJson<void>("DELETE", `/companies/${id}`);

// ── Berths ───────────────────────────────────────────────────────────

export type BerthRequestDTO = {
  berthName: string;
  isActive: boolean;
};
export type BerthResponseDTO = BerthRequestDTO & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export const getAllBerths = () => getJson<BerthResponseDTO[]>("/berths");
export const getBerth = (id: string) => getJson<BerthResponseDTO>(`/berths/${id}`);
export const createBerth = (d: BerthRequestDTO) => sendJson<BerthResponseDTO>("POST", "/berths", d);
export const updateBerth = (id: string, d: BerthRequestDTO) => sendJson<BerthResponseDTO>("PUT", `/berths/${id}`, d);
export const deleteBerth = (id: string) => sendJson<void>("DELETE", `/berths/${id}`);

// ── Berth Allocations (berth ↔ vessel) ───────────────────────────────

export type BerthAllocationRequestDTO = {
  berthId: string;
  vesselId: string;
  startDate: string;
  endDate: string;
};
export type BerthAllocationResponseDTO = BerthAllocationRequestDTO & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export const getAllBerthAllocations = () => getJson<BerthAllocationResponseDTO[]>("/berth-allocations");
export const getBerthAllocation = (id: string) => getJson<BerthAllocationResponseDTO>(`/berth-allocations/${id}`);
export const createBerthAllocation = (d: BerthAllocationRequestDTO) => sendJson<BerthAllocationResponseDTO>("POST", "/berth-allocations", d);
export const updateBerthAllocation = (id: string, d: BerthAllocationRequestDTO) => sendJson<BerthAllocationResponseDTO>("PUT", `/berth-allocations/${id}`, d);
export const deleteBerthAllocation = (id: string) => sendJson<void>("DELETE", `/berth-allocations/${id}`);

// ── Berth Seafarer Allocations (berth ↔ seafarer) ────────────────────

export type BerthSeafarerAllocationRequestDTO = {
  berthId: string;
  indosMasterId: string;
  berthAllocationId?: string;
  startDate: string;
  endDate: string;
};
export type BerthSeafarerAllocationResponseDTO = BerthSeafarerAllocationRequestDTO & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export const getAllBerthSeafarerAllocations = () => getJson<BerthSeafarerAllocationResponseDTO[]>("/berth-seafarer-allocations");
export const getBerthSeafarerAllocation = (id: string) => getJson<BerthSeafarerAllocationResponseDTO>(`/berth-seafarer-allocations/${id}`);
export const createBerthSeafarerAllocation = (d: BerthSeafarerAllocationRequestDTO) => sendJson<BerthSeafarerAllocationResponseDTO>("POST", "/berth-seafarer-allocations", d);
export const updateBerthSeafarerAllocation = (id: string, d: BerthSeafarerAllocationRequestDTO) => sendJson<BerthSeafarerAllocationResponseDTO>("PUT", `/berth-seafarer-allocations/${id}`, d);
export const deleteBerthSeafarerAllocation = (id: string) => sendJson<void>("DELETE", `/berth-seafarer-allocations/${id}`);

// ── Audit Logs (read-only) ───────────────────────────────────────────

export type AuditLogsResponseDTO = {
  id: string;
  tableName: string;
  operation: string;
  recordId: string;
  oldValues?: string;
  newValues?: string;
  changedBy?: string;
  changedAt: string;
};

export const getAllAuditLogs = () => getJson<AuditLogsResponseDTO[]>("/audit-logs");
export const getAuditLog = (id: string) => getJson<AuditLogsResponseDTO>(`/audit-logs/${id}`);
