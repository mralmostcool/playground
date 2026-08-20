"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAllInstitutes,
  getAllCourses,
  getAllEnrollments,
  getAllIndos,
  updateCourse,
  deleteCourse,
  updateEnrollment,
  toSlug,
  InstituteResponseDTO,
  PreSeaCoursesResponseDTO,
  EnrollmentResponseDTO,
  IndosMasterResponseDTO,
  PreSeaCoursesRequestDTO
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../../../PublicLayoutClient";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const instSlug = params.instSlug as string;
  const courseSlug = params.courseSlug as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolved IDs
  const [id, setId] = useState<string | null>(null); // instituteId
  const [courseId, setCourseId] = useState<string | null>(null); // courseId

  // Collections
  const [course, setCourse] = useState<PreSeaCoursesResponseDTO | null>(null);
  const [institute, setInstitute] = useState<InstituteResponseDTO | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentResponseDTO[]>([]);
  const [seafarers, setSeafarers] = useState<IndosMasterResponseDTO[]>([]);

  // Navigation tab for filtering candidate status
  const [activeStatusTab, setActiveStatusTab] = useState<"all" | "ENROLLED" | "COMPLETED" | "CANCELLED">("all");

  // Edit / Delete Course forms and modals
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [editCourseForm, setEditCourseForm] = useState<PreSeaCoursesRequestDTO>({
    name: "",
    isActive: true,
    startDate: new Date().toISOString().split("T")[0],
    instituteId: ""
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Pending Status Updates for candidates
  const [pendingStatuses, setPendingStatuses] = useState<Record<string, "ENROLLED" | "COMPLETED" | "CANCELLED">>({});
  const [updatingStatuses, setUpdatingStatuses] = useState<Record<string, boolean>>({});

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allInstitutes, allCourses, allEnrollments, allSeafarers] = await Promise.all([
        getAllInstitutes(),
        getAllCourses(),
        getAllEnrollments(),
        getAllIndos()
      ]);

      const foundInst = allInstitutes.find((inst) => toSlug(inst.name) === instSlug);
      if (!foundInst) {
        setError("Institute records not found.");
        return;
      }
      setInstitute(foundInst);
      const instId = foundInst.id;
      setId(instId);

      const foundCourse = allCourses.find(
        (c) => toSlug(c.name) === courseSlug && c.instituteId === instId
      );
      if (!foundCourse) {
        setError("Course records not found.");
        return;
      }
      setCourse(foundCourse);
      const cId = foundCourse.id;
      setCourseId(cId);
      
      // Filter enrollments for this specific course
      setEnrollments(allEnrollments.filter((e) => e.preSeaCourseId === cId));
      setSeafarers(allSeafarers);
    } catch (err: any) {
      console.error("Failed to load course details", err);
      setError("Failed to query course records from backend registries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (instSlug && courseSlug) {
      loadData();
    }
  }, [instSlug, courseSlug]);

  // Edit Course Trigger
  const handleEditClick = () => {
    if (!course || !id) return;
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
    if (!courseId || !id) return;
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
      await updateCourse(courseId, {
        name: editCourseForm.name.trim(),
        isActive: editCourseForm.isActive,
        startDate: editCourseForm.startDate,
        instituteId: id
      });
      setFormSuccess("Course updated successfully.");
      
      const updated = await getCourse(courseId);
      setCourse(updated);

      setTimeout(() => {
        setFormSuccess(null);
        setIsEditCourseModalOpen(false);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "An error occurred while updating course.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseId) return;
    if (!confirm("Are you sure you want to delete this course?")) return;
    setFormError(null);
    setFormSuccess(null);
    setSaving(true);
    try {
      await deleteCourse(courseId);
      setFormSuccess("Course deleted successfully.");
      setTimeout(() => {
        setFormSuccess(null);
        router.push(`/courses/${instSlug}`);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "An error occurred while deleting course.");
      setSaving(false);
    }
  };

  // Change Candidate Enrollment Status
  const handleStatusChange = async (enrollment: EnrollmentResponseDTO, newStatus: "ENROLLED" | "COMPLETED" | "CANCELLED") => {
    if (!courseId) return;
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
      setEnrollments(allEnrollments.filter((e) => e.preSeaCourseId === courseId));

      // Clear pending
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

  // Local filtering based on activeStatusTab
  const filteredEnrollments = enrollments.filter((e) => {
    if (activeStatusTab === "all") return true;
    return e.status === activeStatusTab;
  });

  const getSeafarerName = (seafarerId: string) => {
    return seafarers.find((s) => s.id === seafarerId)?.firstName ?? "Unknown Candidate";
  };

  const getSeafarerIndos = (seafarerId: string) => {
    return seafarers.find((s) => s.id === seafarerId)?.indos ?? "N/A";
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-muted">
        Syncing course profile details...
      </div>
    );
  }

  if (error || !course || !institute) {
    return (
      <div className="py-24 text-center text-sm text-error">
        {error || "Course records not found."}{" "}
        <Link href={`/courses/${instSlug}`} className="text-primary hover:underline ml-1">
          Return to institute details
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <PublicLayoutHeader deps={[course.id, course.name, course.isActive]}>
        <div className="flex flex-col gap-2">
          <Link href={`/courses/${instSlug}`} className="text-xs text-primary hover:underline inline-flex items-center gap-1.5 font-medium mb-1">
            &larr; Back to {institute.name}
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-serif text-ink">{course.name}</h1>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
              course.isActive ? "bg-success/15 text-success" : "bg-muted/15 text-muted"
            }`}>
              {course.isActive ? "Active Listing" : "Inactive"}
            </span>
          </div>
        </div>
      </PublicLayoutHeader>

      {/* Sidebar Details Info */}
      <PublicLayoutSidebar deps={[course.id, course.startDate, course.isActive, institute.name]}>
        <div className="flex flex-col gap-6 mt-4">
          <div className="bg-surface-soft border border-hairline rounded-lg p-5 flex flex-col gap-4">
            <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">Course Details</h3>
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-soft uppercase font-semibold text-[10px]">Institute Partner</span>
                <span className="text-body-strong font-medium">{institute.name}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-soft uppercase font-semibold text-[10px]">Start Date</span>
                <span className="text-body-strong font-mono">{course.startDate}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-soft uppercase font-semibold text-[10px]">Registry Status</span>
                <span className="text-body-strong">{course.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-hairline flex flex-col gap-2">
              <button
                onClick={handleEditClick}
                className="w-full h-9 bg-primary text-on-primary font-medium text-xs rounded-md hover:bg-primary-active flex items-center justify-center transition-colors cursor-pointer"
              >
                Edit Details
              </button>
              <button
                onClick={handleDeleteCourse}
                className="w-full h-9 bg-error/10 text-error font-medium text-xs rounded-md hover:bg-error/20 border border-error/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      </PublicLayoutSidebar>

      {/* Right Column: Candidate tabs and roster */}
      <div className="flex flex-col gap-6">
        {/* Status Tab Bar */}
        <div className="flex border-b border-hairline">
          {(["all", "ENROLLED", "COMPLETED", "CANCELLED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveStatusTab(tab)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer capitalize ${
                activeStatusTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {tab === "all" ? "All Candidates" : tab.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Candidate List Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-surface-card border-b border-hairline">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">INDOS</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-soft">
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted">
                    No candidates found with this status.
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((e) => {
                  const pendingStatus = pendingStatuses[e.id];
                  const isPending = pendingStatus !== undefined && pendingStatus !== e.status;
                  const currentVal = pendingStatus ?? e.status;

                  return (
                    <tr key={e.id} className="transition-colors hover:bg-surface-soft/40">
                      <td className="px-4 py-3.5 text-sm font-mono text-ink">{getSeafarerIndos(e.indosMasterId)}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-body-strong">{getSeafarerName(e.indosMasterId)}</td>
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
      </div>

      {/* Edit Course Modal */}
      {isEditCourseModalOpen && (
        <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-surface-card border border-hairline rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]" style={{ width: "100%", maxWidth: "448px" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-soft">
              <div>
                <h2 className="text-lg font-serif text-ink">Edit Course Details</h2>
                <p className="text-[11px] text-muted mt-0.5">Modify the metadata of this pre-sea course listing.</p>
              </div>
              <button
                onClick={() => {
                  setIsEditCourseModalOpen(false);
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

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">START DATE</label>
                  <input
                    type="date"
                    value={editCourseForm.startDate}
                    onChange={(e) => setEditCourseForm({ ...editCourseForm, startDate: e.target.value })}
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

                <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditCourseModalOpen(false);
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
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
