"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getInstitute,
  getAllCourses,
  getAllEnrollments,
  getAllIndos,
  createCourse,
  updateCourse,
  deleteCourse,
  updateEnrollment,
  InstituteResponseDTO,
  PreSeaCoursesResponseDTO,
  EnrollmentResponseDTO,
  IndosMasterResponseDTO,
  PreSeaCoursesRequestDTO
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../../PublicLayoutClient";

export default function InstituteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Collections
  const [institute, setInstitute] = useState<InstituteResponseDTO | null>(null);
  const [courses, setCourses] = useState<PreSeaCoursesResponseDTO[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentResponseDTO[]>([]);
  const [seafarers, setSeafarers] = useState<IndosMasterResponseDTO[]>([]);

  // Navigation / Tab state in Sidebar
  const [activeTab, setActiveTab] = useState<"courses" | "candidates">("courses");

  // Search, modals, forms for Course management
  const [courseSearch, setCourseSearch] = useState("");
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<PreSeaCoursesResponseDTO | null>(null);

  const [courseForm, setCourseForm] = useState<PreSeaCoursesRequestDTO>({
    name: "",
    isActive: true,
    startDate: new Date().toISOString().split("T")[0],
    instituteId: id
  });
  const [editCourseForm, setEditCourseForm] = useState<PreSeaCoursesRequestDTO>({
    name: "",
    isActive: true,
    startDate: new Date().toISOString().split("T")[0],
    instituteId: id
  });

  const [pendingStatuses, setPendingStatuses] = useState<Record<string, "ENROLLED" | "COMPLETED" | "CANCELLED">>({});

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [liveInst, allCourses, allEnrollments, allSeafarers] = await Promise.all([
        getInstitute(id),
        getAllCourses(),
        getAllEnrollments(),
        getAllIndos()
      ]);

      setInstitute(liveInst);
      
      // Filter courses for this institute
      const instCourses = allCourses.filter((c) => c.instituteId === id);
      setCourses(instCourses);

      // Filter enrollments for this institute's courses
      const instEnrollments = allEnrollments.filter((e) =>
        instCourses.some((c) => c.id === e.preSeaCourseId)
      );
      setEnrollments(instEnrollments);
      setSeafarers(allSeafarers);
    } catch (err: any) {
      console.error("Failed to load institute details", err);
      setError("Failed to query records for this institute from backend database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  // Local courses search filtering
  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(courseSearch.toLowerCase())
  );

  // Add Course Handler
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!courseForm.name || courseForm.name.trim().length === 0) {
      setFormError("Course name is required.");
      return;
    }
    if (!courseForm.startDate) {
      setFormError("Start date is required.");
      return;
    }

    setSaving(true);
    try {
      await createCourse({
        name: courseForm.name.trim(),
        isActive: courseForm.isActive,
        startDate: courseForm.startDate,
        instituteId: id
      });
      setFormSuccess("Course registered successfully.");

      const updated = await getAllCourses();
      setCourses(updated.filter((c) => c.instituteId === id));

      setCourseForm({
        name: "",
        isActive: true,
        startDate: new Date().toISOString().split("T")[0],
        instituteId: id
      });

      setTimeout(() => {
        setFormSuccess(null);
        setIsCourseModalOpen(false);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "An error occurred while creating course.");
    } finally {
      setSaving(false);
    }
  };

  // Edit Course Handlers
  const handleEditClick = (course: PreSeaCoursesResponseDTO) => {
    setSelectedCourse(course);
    setEditCourseForm({
      name: course.name,
      isActive: course.isActive,
      startDate: course.startDate,
      instituteId: id
    });
    setFormError(null);
    setFormSuccess(null);
    setIsEditCourseModalOpen(true);
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setFormError(null);
    setFormSuccess(null);

    if (!editCourseForm.name || editCourseForm.name.trim().length === 0) {
      setFormError("Course name is required.");
      return;
    }
    if (!editCourseForm.startDate) {
      setFormError("Start date is required.");
      return;
    }

    setSaving(true);
    try {
      await updateCourse(selectedCourse.id, {
        name: editCourseForm.name.trim(),
        isActive: editCourseForm.isActive,
        startDate: editCourseForm.startDate,
        instituteId: id
      });
      setFormSuccess("Course updated successfully.");

      const updated = await getAllCourses();
      setCourses(updated.filter((c) => c.instituteId === id));

      setTimeout(() => {
        setFormSuccess(null);
        setIsEditCourseModalOpen(false);
        setSelectedCourse(null);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "An error occurred while updating course.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    if (!confirm("Are you sure you want to delete this course?")) return;
    setFormError(null);
    setFormSuccess(null);
    setSaving(true);
    try {
      await deleteCourse(selectedCourse.id);
      setFormSuccess("Course deleted successfully.");

      const updated = await getAllCourses();
      setCourses(updated.filter((c) => c.instituteId === id));

      setTimeout(() => {
        setFormSuccess(null);
        setIsEditCourseModalOpen(false);
        setSelectedCourse(null);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "An error occurred while deleting course.");
    } finally {
      setSaving(false);
    }
  };

  // Change Candidate Enrollment Status
  const [updatingStatuses, setUpdatingStatuses] = useState<Record<string, boolean>>({});

  const handleStatusChange = async (enrollment: EnrollmentResponseDTO, newStatus: "ENROLLED" | "COMPLETED" | "CANCELLED") => {
    setUpdatingStatuses((prev) => ({ ...prev, [enrollment.id]: true }));
    try {
      await updateEnrollment(enrollment.id, {
        preSeaCourseId: enrollment.preSeaCourseId,
        indosMasterId: enrollment.indosMasterId,
        status: newStatus,
        remarks: enrollment.remarks
      });
      
      // Reload enrollments
      const allEnrollments = await getAllEnrollments();
      setEnrollments(allEnrollments.filter((e) =>
        courses.some((c) => c.id === e.preSeaCourseId)
      ));

      // Clear pending status
      setPendingStatuses((prev) => {
        const next = { ...prev };
        delete next[enrollment.id];
        return next;
      });
    } catch (err: any) {
      alert("Failed to update candidate status: " + (err.message || err));
    } finally {
      setUpdatingStatuses((prev) => ({ ...prev, [enrollment.id]: false }));
    }
  };

  const getSeafarerName = (seafarerId: string) => {
    return seafarers.find((s) => s.id === seafarerId)?.firstName ?? "Unknown Candidate";
  };

  const getSeafarerIndos = (seafarerId: string) => {
    return seafarers.find((s) => s.id === seafarerId)?.indos ?? "N/A";
  };

  const getCourseName = (courseId: string) => {
    return courses.find((c) => c.id === courseId)?.name ?? "Unknown Course";
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-muted">
        Syncing institute details with registry...
      </div>
    );
  }

  if (error || !institute) {
    return (
      <div className="py-24 text-center text-sm text-error">
        {error || "Institute records not found."}{" "}
        <Link href="/courses" className="text-primary hover:underline ml-1">
          Return to directory
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <PublicLayoutHeader deps={[institute.id, institute.name]}>
        <div className="flex flex-col gap-2">
          <Link href="/courses" className="text-xs text-primary hover:underline inline-flex items-center gap-1.5 font-medium mb-1">
            &larr; Back to Directory
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-serif text-ink">{institute.name}</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">
              Training Academy
            </span>
          </div>
        </div>
      </PublicLayoutHeader>

      {/* Sidebar Navigation */}
      <PublicLayoutSidebar deps={[activeTab]}>
        <div className="flex flex-col gap-6 mt-4">
          <nav className="flex flex-col gap-1.5 border-b lg:border-b-0 pb-4 lg:pb-0">
            <button
              onClick={() => setActiveTab("courses")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeTab === "courses"
                  ? "bg-primary text-on-primary font-semibold shadow-sm"
                  : "text-muted hover:bg-surface-soft hover:text-ink"
              }`}
            >
              Manage Courses
            </button>
            <button
              onClick={() => setActiveTab("candidates")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeTab === "candidates"
                  ? "bg-primary text-on-primary font-semibold shadow-sm"
                  : "text-muted hover:bg-surface-soft hover:text-ink"
              }`}
            >
              View Registered Candidates
            </button>
          </nav>
        </div>
      </PublicLayoutSidebar>

      {/* Main Content Column */}
      <div className="flex flex-col gap-6">
        {activeTab === "courses" ? (
          // ── MANAGE COURSES PANEL ───────────────────────────────────────────
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search course listings..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="w-full text-input px-4 bg-canvas text-ink border border-muted focus:border-primary rounded-md outline-none"
                  style={{ height: "42px" }}
                />
              </div>
              <button
                onClick={() => {
                  setFormError(null);
                  setFormSuccess(null);
                  setIsCourseModalOpen(true);
                }}
                className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-sm transition-colors cursor-pointer flex-shrink-0"
              >
                Add Course
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-surface-card border-b border-hairline">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Course Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Start Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline-soft">
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-sm text-muted">
                        No courses offered by this institute.
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((c) => (
                      <tr 
                        key={c.id} 
                        onClick={() => router.push(`/courses/${id}/${c.id}`)}
                        className="cursor-pointer transition-colors hover:bg-surface-soft/40"
                      >
                        <td className="px-4 py-3.5 text-sm font-medium text-body-strong">{c.name}</td>
                        <td className="px-4 py-3.5 text-sm font-mono text-body-text">{c.startDate}</td>
                        <td className="px-4 py-3.5 text-sm">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.isActive ? "bg-success/10 text-success" : "bg-muted/10 text-muted"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? "bg-success" : "bg-muted"}`}></span>
                            {c.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          // ── VIEW REGISTERED CANDIDATES PANEL ──────────────────────────────────
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-surface-card border-b border-hairline">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">INDOS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline-soft">
                  {enrollments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted">
                        No candidates registered in courses of this academy.
                      </td>
                    </tr>
                  ) : (
                    enrollments.map((e) => {
                      const pendingStatus = pendingStatuses[e.id];
                      const isPending = pendingStatus !== undefined && pendingStatus !== e.status;
                      const currentVal = pendingStatus ?? e.status;

                      return (
                        <tr key={e.id} className="transition-colors hover:bg-surface-soft/40">
                          <td className="px-4 py-3.5 text-sm font-mono text-ink">{getSeafarerIndos(e.indosMasterId)}</td>
                          <td className="px-4 py-3.5 text-sm font-medium text-body-strong">{getSeafarerName(e.indosMasterId)}</td>
                          <td className="px-4 py-3.5 text-sm text-body-text">{getCourseName(e.preSeaCourseId)}</td>
                          <td className="px-4 py-3.5 text-sm">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              e.status === "COMPLETED"
                                ? "bg-success/10 text-success"
                                : e.status === "CANCELLED"
                                ? "bg-error/10 text-error"
                                : "bg-primary/10 text-primary"
                            }`}>
                              {e.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-sm">
                            <div className="flex items-center gap-2">
                              <select
                                value={currentVal}
                                onChange={(event) => {
                                  const val = event.target.value as "ENROLLED" | "COMPLETED" | "CANCELLED";
                                  setPendingStatuses((prev) => ({ ...prev, [e.id]: val }));
                                }}
                                className="bg-canvas border border-muted focus:border-primary text-ink text-xs rounded-md outline-none px-2 py-1 cursor-pointer"
                                disabled={updatingStatuses[e.id]}
                              >
                                <option value="ENROLLED">Enrolled</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>

                              {isPending && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleStatusChange(e, pendingStatus)}
                                    disabled={updatingStatuses[e.id]}
                                    title="Confirm status change"
                                    className="p-1 text-success hover:bg-success/15 rounded cursor-pointer transition-colors disabled:opacity-50"
                                  >
                                    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setPendingStatuses((prev) => {
                                        const next = { ...prev };
                                        delete next[e.id];
                                        return next;
                                      });
                                    }}
                                    disabled={updatingStatuses[e.id]}
                                    title="Cancel"
                                    className="p-1 text-error hover:bg-error/15 rounded cursor-pointer transition-colors disabled:opacity-50"
                                  >
                                    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-surface-card border border-hairline rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]" style={{ width: "100%", maxWidth: "448px" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-soft">
              <div>
                <h2 className="text-lg font-serif text-ink">Add New Course</h2>
                <p className="text-[11px] text-muted mt-0.5">Register a new course under this institute.</p>
              </div>
              <button
                onClick={() => {
                  setIsCourseModalOpen(false);
                  setFormError(null);
                  setFormSuccess(null);
                }}
                className="text-muted hover:text-ink transition-colors p-1 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {formError && <div className="p-3 bg-error/10 text-error rounded-md text-xs font-medium border border-error/20">{formError}</div>}
              {formSuccess && <div className="p-3 bg-success/10 text-success rounded-md text-xs font-medium border border-success/20">{formSuccess}</div>}

              <form onSubmit={handleAddCourse} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">COURSE NAME</label>
                  <input
                    type="text"
                    placeholder="Course name (e.g. Pre-Sea Deck Cadet)"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">START DATE</label>
                  <input
                    type="date"
                    value={courseForm.startDate}
                    onChange={(e) => setCourseForm({ ...courseForm, startDate: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="form-isActive"
                    checked={courseForm.isActive}
                    onChange={(e) => setCourseForm({ ...courseForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
                  />
                  <label htmlFor="form-isActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
                    ACTIVE COURSE STATUS
                  </label>
                </div>

                <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCourseModalOpen(false);
                      setFormError(null);
                      setFormSuccess(null);
                    }}
                    className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
                  >
                    {saving ? "Registering..." : "Save Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {isEditCourseModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-surface-card border border-hairline rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]" style={{ width: "100%", maxWidth: "448px" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-soft">
              <div>
                <h2 className="text-lg font-serif text-ink">Edit Course</h2>
                <p className="text-[11px] text-muted mt-0.5">Modify or delete the pre-sea course in the directory.</p>
              </div>
              <button
                onClick={() => {
                  setIsEditCourseModalOpen(false);
                  setFormError(null);
                  setFormSuccess(null);
                  setSelectedCourse(null);
                }}
                className="text-muted hover:text-ink transition-colors p-1 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {formError && <div className="p-3 bg-error/10 text-error rounded-md text-xs font-medium border border-error/20">{formError}</div>}
              {formSuccess && <div className="p-3 bg-success/10 text-success rounded-md text-xs font-medium border border-success/20">{formSuccess}</div>}

              <form onSubmit={handleUpdateCourse} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">COURSE NAME</label>
                  <input
                    type="text"
                    placeholder="Course name (e.g. Pre-Sea Deck Cadet)"
                    value={editCourseForm.name}
                    onChange={(e) => setEditCourseForm({ ...editCourseForm, name: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="edit-form-isActive"
                    checked={editCourseForm.isActive}
                    onChange={(e) => setEditCourseForm({ ...editCourseForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
                  />
                  <label htmlFor="edit-form-isActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
                    ACTIVE COURSE STATUS
                  </label>
                </div>

                {/* Modal Actions */}
                <div className="pt-4 border-t border-hairline flex justify-between gap-3 mt-2">
                  <button
                    type="button"
                    onClick={handleDeleteCourse}
                    className="h-10 px-4 bg-error/10 text-error font-medium rounded-md hover:bg-error/20 border border-error/20 inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
                  >
                    Delete Course
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditCourseModalOpen(false);
                        setFormError(null);
                        setFormSuccess(null);
                        setSelectedCourse(null);
                      }}
                      className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
