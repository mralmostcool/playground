"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAllCourses,
  getAllInstitutes,
  createCourse,
  createInstitute,
  updateCourse,
  deleteCourse,
  toSlug,
  PreSeaCoursesRequestDTO,
  PreSeaCoursesResponseDTO,
  InstituteRequestDTO,
  InstituteResponseDTO
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../PublicLayoutClient";

export default function CoursesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"institutes" | "courses">("institutes");

  // Core Collections
  const [courses, setCourses] = useState<PreSeaCoursesResponseDTO[]>([]);
  const [institutes, setInstitutes] = useState<InstituteResponseDTO[]>([]);

  // Search & Pagination States
  const [courseSearch, setCourseSearch] = useState("");
  const [instituteSearch, setInstituteSearch] = useState("");
  const [selectedInstituteId, setSelectedInstituteId] = useState<string | null>(null);

  const [coursePage, setCoursePage] = useState(0);
  const [institutePage, setInstitutePage] = useState(0);
  const [size] = useState(10); // Standard 10 per page

  // Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isInstituteModalOpen, setIsInstituteModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<PreSeaCoursesResponseDTO | null>(null);

  // Form States
  const [courseForm, setCourseForm] = useState<PreSeaCoursesRequestDTO>({
    name: "",
    isActive: true,
    startDate: new Date().toISOString().split("T")[0],
    instituteId: ""
  });
  const [editCourseForm, setEditCourseForm] = useState<PreSeaCoursesRequestDTO>({
    name: "",
    isActive: true,
    startDate: new Date().toISOString().split("T")[0],
    instituteId: ""
  });
  const [instForm, setInstForm] = useState<InstituteRequestDTO>({
    name: ""
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [liveInstitutes, liveCourses] = await Promise.all([
        getAllInstitutes(),
        getAllCourses()
      ]);

      setInstitutes(liveInstitutes);
      setCourses(liveCourses);
    } catch (err: any) {
      console.error("Failed to load registry data", err);
      setError("Failed to sync with maritime registry databases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculation of Active Courses Count per Institute
  const getActiveCoursesCount = (instId: string) => {
    return courses.filter((c) => c.instituteId === instId && c.isActive).length;
  };

  // Course Filtering
  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesInstitute = selectedInstituteId ? c.instituteId === selectedInstituteId : true;
    return matchesSearch && matchesInstitute;
  });

  // Institute Filtering
  const filteredInstitutes = institutes.filter((i) =>
    i.name.toLowerCase().includes(instituteSearch.toLowerCase())
  );

  // Pagination course
  const totalCourseElements = filteredCourses.length;
  const totalCoursePages = Math.ceil(totalCourseElements / size);
  const paginatedCourses = filteredCourses.slice(coursePage * size, (coursePage + 1) * size);

  // Pagination institute
  const totalInstElements = filteredInstitutes.length;
  const totalInstPages = Math.ceil(totalInstElements / size);
  const paginatedInstitutes = filteredInstitutes.slice(institutePage * size, (institutePage + 1) * size);

  // Resets
  useEffect(() => {
    setCoursePage(0);
  }, [courseSearch, selectedInstituteId]);

  useEffect(() => {
    setInstitutePage(0);
  }, [instituteSearch]);

  const getInstituteName = (instId?: string) => {
    if (!instId) return "N/A";
    return institutes.find((i) => i.id === instId)?.name ?? "Unknown Institute";
  };

  // Create Course Handler
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
        instituteId: courseForm.instituteId || undefined
      });
      setFormSuccess("Course registered successfully.");

      // Reload
      const updated = await getAllCourses();
      setCourses(updated);

      setCourseForm({
        name: "",
        isActive: true,
        startDate: new Date().toISOString().split("T")[0],
        instituteId: ""
      });

      setTimeout(() => {
        setFormSuccess(null);
        setIsCourseModalOpen(false);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "An error occurred while creating the course.");
    } finally {
      setSaving(false);
    }
  };

  // Create Institute Handler
  const handleAddInstitute = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!instForm.name || instForm.name.trim().length === 0) {
      setFormError("Institute name is required.");
      return;
    }

    setSaving(true);
    try {
      await createInstitute({
        name: instForm.name.trim()
      });
      setFormSuccess("Institute registered successfully.");

      // Reload both since course creation needs updated institutes dropdown
      const [updatedInsts, updatedCourses] = await Promise.all([
        getAllInstitutes(),
        getAllCourses()
      ]);
      setInstitutes(updatedInsts);
      setCourses(updatedCourses);

      setInstForm({ name: "" });

      setTimeout(() => {
        setFormSuccess(null);
        setIsInstituteModalOpen(false);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "An error occurred while creating the institute.");
    } finally {
      setSaving(false);
    }
  };

  const handleInstituteClick = (inst: InstituteResponseDTO) => {
    router.push(`/courses/${toSlug(inst.name)}`);
  };

  const handleEditClick = (course: PreSeaCoursesResponseDTO) => {
    setSelectedCourse(course);
    setEditCourseForm({
      name: course.name,
      isActive: course.isActive,
      startDate: course.startDate,
      instituteId: course.instituteId || ""
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
        instituteId: editCourseForm.instituteId || undefined
      });
      setFormSuccess("Course updated successfully.");
      
      const updated = await getAllCourses();
      setCourses(updated);

      setTimeout(() => {
        setFormSuccess(null);
        setIsEditCourseModalOpen(false);
        setSelectedCourse(null);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "An error occurred while updating the course.");
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
      setCourses(updated);

      setTimeout(() => {
        setFormSuccess(null);
        setIsEditCourseModalOpen(false);
        setSelectedCourse(null);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "An error occurred while deleting the course.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Header */}
      <PublicLayoutHeader deps={[activeTab, totalCourseElements, totalInstElements]}>
        <span className="text-xs text-primary font-bold uppercase tracking-wider">Public Access Panel</span>
        <h1 className="text-3xl font-serif text-ink">Course & Institutes</h1>
        <p className="text-muted text-sm leading-relaxed mt-2">
          Manage approved pre-sea training courses and authorized maritime academies.
        </p>
      </PublicLayoutHeader>

      {/* Sidebar Stats */}
      <PublicLayoutSidebar deps={[activeTab, totalCourseElements, totalInstElements]}>
        <div className="flex flex-col gap-6 mt-4">
          <div className="bg-surface-soft border border-hairline rounded-lg p-5 flex flex-col gap-4">
            <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">Registry Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-serif text-ink">{totalCourseElements}</span>
                <span className="text-[9px] text-muted-soft font-mono uppercase tracking-wider">Total Courses</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-serif text-ink">{totalInstElements}</span>
                <span className="text-[9px] text-muted-soft font-mono uppercase tracking-wider">Institutes</span>
              </div>
            </div>
          </div>
        </div>
      </PublicLayoutSidebar>

      {/* Main Content Column */}
      <div className="flex flex-col gap-6">
        {/* Tab Selection */}
        <div className="flex border-b border-hairline">
          <button
            onClick={() => setActiveTab("institutes")}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "institutes"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            Authorized Institutes
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "courses"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            Pre-Sea Courses
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-muted">
            Syncing data with registries...
          </div>
        ) : error ? (
          <div className="p-4 bg-error/10 text-error rounded-md text-xs font-medium border border-error/20 text-center">
            {error}
          </div>
        ) : (
          <>
            {activeTab === "courses" ? (
              // ── COURSES VIEW ────────────────────────────────────────────────
              <>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-grow">
                      <input
                        type="text"
                        placeholder="Search courses by name..."
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

                  {/* Active Filter Chips */}
                  {(selectedInstituteId || courseSearch) && (
                    <div className="flex flex-wrap gap-2 items-center text-xs mt-1">
                      <span className="text-muted font-medium">Active Filters:</span>
                      {selectedInstituteId && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                          <span>Institute: {getInstituteName(selectedInstituteId)}</span>
                          <button
                            onClick={() => setSelectedInstituteId(null)}
                            className="hover:text-primary-active transition-colors font-bold cursor-pointer"
                          >
                            ✕
                          </button>
                        </span>
                      )}
                      {courseSearch && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-teal/10 text-accent-teal border border-accent-teal/20 font-medium">
                          <span>Search: "{courseSearch}"</span>
                          <button
                            onClick={() => setCourseSearch("")}
                            className="hover:text-accent-teal-active transition-colors font-bold cursor-pointer"
                          >
                            ✕
                          </button>
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedInstituteId(null);
                          setCourseSearch("");
                        }}
                        className="text-muted hover:text-ink transition-colors underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-surface-card border-b border-hairline">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Course Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Institute</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Start Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline-soft">
                      {paginatedCourses.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted">
                            No courses registered in directory.
                          </td>
                        </tr>
                      ) : (
                        paginatedCourses.map((c) => (
                          <tr key={c.id} className="transition-colors hover:bg-surface-soft/40">
                            <td className="px-4 py-3.5 text-sm font-medium text-body-strong">{c.name}</td>
                            <td className="px-4 py-3.5 text-sm text-body-text">{getInstituteName(c.instituteId)}</td>
                            <td className="px-4 py-3.5 text-sm font-mono text-body-text">{c.startDate}</td>
                            <td className="px-4 py-3.5 text-sm">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.isActive ? "bg-success/10 text-success" : "bg-muted/10 text-muted"}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? "bg-success" : "bg-muted"}`}></span>
                                {c.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-sm">
                              <button
                                onClick={() => handleEditClick(c)}
                                className="text-primary hover:text-primary-active font-semibold cursor-pointer transition-colors"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {totalCoursePages > 1 && (
                  <div className="flex items-center justify-between border-t border-hairline pt-4 mt-2 text-xs">
                    <span className="text-muted font-mono">
                      Showing {coursePage * size + 1} to {Math.min((coursePage + 1) * size, totalCourseElements)} of {totalCourseElements} courses
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCoursePage(p => Math.max(0, p - 1))}
                        disabled={coursePage === 0}
                        className="h-8 px-3 border border-hairline rounded bg-canvas hover:bg-surface-soft hover:text-ink disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        Previous
                      </button>
                      <span className="font-mono text-body-strong">
                        Page {coursePage + 1} of {totalCoursePages}
                      </span>
                      <button
                        onClick={() => setCoursePage(p => Math.min(totalCoursePages - 1, p + 1))}
                        disabled={coursePage === totalCoursePages - 1}
                        className="h-8 px-3 border border-hairline rounded bg-canvas hover:bg-surface-soft hover:text-ink disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // ── INSTITUTES VIEW ─────────────────────────────────────────────
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Search institutes by name..."
                      value={instituteSearch}
                      onChange={(e) => setInstituteSearch(e.target.value)}
                      className="w-full text-input px-4 bg-canvas text-ink border border-muted focus:border-primary rounded-md outline-none"
                      style={{ height: "42px" }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setFormError(null);
                      setFormSuccess(null);
                      setIsInstituteModalOpen(true);
                    }}
                    className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-sm transition-colors cursor-pointer flex-shrink-0"
                  >
                    Add Institute
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-surface-card border-b border-hairline">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Institute Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Active Courses</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Created Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline-soft">
                      {paginatedInstitutes.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-8 text-center text-sm text-muted">
                            No institutes registered in directory.
                          </td>
                        </tr>
                      ) : (
                        paginatedInstitutes.map((i) => (
                          <tr
                            key={i.id}
                            onClick={() => handleInstituteClick(i)}
                            className="cursor-pointer transition-colors hover:bg-surface-soft/40"
                          >
                            <td className="px-4 py-3.5 text-sm font-medium text-body-strong">{i.name}</td>
                            <td className="px-4 py-3.5 text-sm">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                {getActiveCoursesCount(i.id)} Active
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-sm font-mono text-body-text">
                              {i.createdAt ? new Date(i.createdAt).toISOString().split("T")[0] : "N/A"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {totalInstPages > 1 && (
                  <div className="flex items-center justify-between border-t border-hairline pt-4 mt-2 text-xs">
                    <span className="text-muted font-mono">
                      Showing {institutePage * size + 1} to {Math.min((institutePage + 1) * size, totalInstElements)} of {totalInstElements} institutes
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setInstitutePage(p => Math.max(0, p - 1))}
                        disabled={institutePage === 0}
                        className="h-8 px-3 border border-hairline rounded bg-canvas hover:bg-surface-soft hover:text-ink disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        Previous
                      </button>
                      <span className="font-mono text-body-strong">
                        Page {institutePage + 1} of {totalInstPages}
                      </span>
                      <button
                        onClick={() => setInstitutePage(p => Math.min(totalInstPages - 1, p + 1))}
                        disabled={institutePage === totalInstPages - 1}
                        className="h-8 px-3 border border-hairline rounded bg-canvas hover:bg-surface-soft hover:text-ink disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
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
                <p className="text-[11px] text-muted mt-0.5">Register a new pre-sea course in the directory.</p>
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
                  <label className="text-xs font-semibold text-body-strong">TRAINING INSTITUTE</label>
                  <select
                    value={courseForm.instituteId || ""}
                    onChange={(e) => setCourseForm({ ...courseForm, instituteId: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  >
                    <option value="">Select Training Institute</option>
                    {institutes.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
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

      {/* Add Institute Modal */}
      {isInstituteModalOpen && (
        <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-surface-card border border-hairline rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]" style={{ width: "100%", maxWidth: "448px" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-soft">
              <div>
                <h2 className="text-lg font-serif text-ink">Add New Institute</h2>
                <p className="text-[11px] text-muted mt-0.5">Register a new training academy in the directory.</p>
              </div>
              <button
                onClick={() => {
                  setIsInstituteModalOpen(false);
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

              <form onSubmit={handleAddInstitute} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">INSTITUTE NAME</label>
                  <input
                    type="text"
                    placeholder="Institute name (e.g. Maritime Academy of India)"
                    value={instForm.name}
                    onChange={(e) => setInstForm({ ...instForm, name: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsInstituteModalOpen(false);
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
                    {saving ? "Registering..." : "Save Institute"}
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

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">TRAINING INSTITUTE</label>
                  <select
                    value={editCourseForm.instituteId || ""}
                    onChange={(e) => setEditCourseForm({ ...editCourseForm, instituteId: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  >
                    <option value="">Select Training Institute</option>
                    {institutes.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
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
