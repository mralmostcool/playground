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
  createEnrollment,
  toSlug,
  InstituteResponseDTO,
  PreSeaCoursesResponseDTO,
  EnrollmentResponseDTO,
  IndosMasterResponseDTO,
  PreSeaCoursesRequestDTO,
  getCourse
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../../../PublicLayoutClient";
import {
  PageHeader,
  SearchBar,
  LoadingSkeleton,
  EmptyState,
  Modal,
  ConfirmDialog,
  StatusBadge,
  TabBar,
  InfoRow,
  useToast
} from "@/components/ui";

type TabId = "candidates" | "enroll";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
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

  // Navigation tab for candidate view vs enroll view
  const [activeTab, setActiveTab] = useState<TabId>("candidates");

  // Edit / Delete Course forms and modals
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [editCourseForm, setEditCourseForm] = useState<PreSeaCoursesRequestDTO>({
    name: "",
    isActive: true,
    startDate: new Date().toISOString().split("T")[0],
    instituteId: ""
  });
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Search filter
  const [candidateSearch, setCandidateSearch] = useState("");
  const [enrollSearch, setEnrollSearch] = useState("");

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

      setEditCourseForm({
        name: foundCourse.name,
        isActive: foundCourse.isActive,
        startDate: foundCourse.startDate,
        instituteId: instId
      });

      // Filter enrollments for this specific course
      setEnrollments(allEnrollments.filter((e) => e.preSeaCourseId === cId));
      setSeafarers(allSeafarers);
    } catch (err: any) {
      console.error("Failed to load course details", err);
      setError("Failed to query course records from backend registries.");
      toast("Error loading course details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (instSlug && courseSlug) {
      loadData();
    }
  }, [instSlug, courseSlug]);

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !id) return;

    if (!editCourseForm.name.trim()) {
      toast("Course name is required.", "warning");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateCourse(courseId, {
        name: editCourseForm.name.trim(),
        isActive: editCourseForm.isActive,
        startDate: editCourseForm.startDate,
        instituteId: id
      });
      setCourse(updated);
      toast("Course details updated successfully.", "success");
      setIsEditCourseModalOpen(false);
      router.push(`/courses/${instSlug}/${toSlug(editCourseForm.name.trim())}`);
    } catch (err: any) {
      toast(err.message || "Failed to update course details.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseId) return;
    try {
      await deleteCourse(courseId);
      toast("Course program deleted successfully.", "success");
      router.push(`/courses/${instSlug}`);
    } catch (err: any) {
      toast(err.message || "Failed to delete course.", "error");
    }
  };

  const handleStatusChange = async (enrollment: EnrollmentResponseDTO, newStatus: "COMPLETED" | "CANCELLED") => {
    if (!courseId) return;
    try {
      await updateEnrollment(enrollment.id, {
        preSeaCourseId: enrollment.preSeaCourseId,
        indosMasterId: enrollment.indosMasterId,
        status: newStatus,
        remarks: enrollment.remarks
      });
      toast(`Candidate status changed to ${newStatus}.`, "success");
      const allEnrollments = await getAllEnrollments();
      setEnrollments(allEnrollments.filter((e) => e.preSeaCourseId === courseId));
    } catch (err: any) {
      toast(err.message || "Failed to update enrollment status.", "error");
    }
  };

  const handleEnrollCandidate = async (seafarerId: string) => {
    if (!courseId) return;
    try {
      await createEnrollment({
        preSeaCourseId: courseId,
        indosMasterId: seafarerId,
        status: "ENROLLED"
      });
      toast("Candidate enrolled successfully.", "success");
      const allEnrollments = await getAllEnrollments();
      setEnrollments(allEnrollments.filter((e) => e.preSeaCourseId === courseId));
    } catch (err: any) {
      toast(err.message || "Failed to enroll candidate.", "error");
    }
  };

  const getSeafarerInfo = (seafarerId: string) => {
    return seafarers.find(s => s.id === seafarerId);
  };

  const getRankName = (rankId: string) => {
    return "Deck Cadet"; // Fallback placeholder
  };

  if (loading) {
    return <LoadingSkeleton rows={4} type="table" />;
  }

  if (error || !course || !institute) {
    return (
      <EmptyState
        message={error || "Course program details could not be resolved."}
        title="Course Profile Error"
        ctaLabel="Back to College"
        onCtaClick={() => router.push(`/courses/${instSlug}`)}
      />
    );
  }

  const filteredCandidates = enrollments
    .map(e => ({ enrollment: e, seafarer: getSeafarerInfo(e.indosMasterId) }))
    .filter(item => {
      if (!item.seafarer) return false;
      const searchStr = candidateSearch.toLowerCase();
      return (
        item.seafarer.firstName.toLowerCase().includes(searchStr) ||
        item.seafarer.indos.toLowerCase().includes(searchStr)
      );
    });

  const availableSeafarers = seafarers.filter(s => {
    const isEnrolled = enrollments.some(e => e.indosMasterId === s.id);
    if (isEnrolled) return false;
    const searchStr = enrollSearch.toLowerCase();
    return s.firstName.toLowerCase().includes(searchStr) || s.indos.toLowerCase().includes(searchStr);
  });

  return (
    <>
      <PublicLayoutHeader deps={[course.id, course.name]}>
        <PageHeader
          title={course.name}
          subtitle={`Academy Partner: ${institute.name} | Start: ${course.startDate}`}
          backHref={`/courses/${instSlug}`}
          backLabel="Back to College"
        >
          <StatusBadge status={course.isActive ? "true" : "false"} />
        </PageHeader>
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[activeTab]}>
        <div className="flex flex-col gap-6 mt-4">
          <nav className="flex flex-col gap-1.5 font-sans">
            <button
              onClick={() => setActiveTab("candidates")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeTab === "candidates"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Enrolled Candidates
            </button>
            <button
              onClick={() => setActiveTab("enroll")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeTab === "enroll"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Enroll New Candidate
            </button>
          </nav>

          <div className="bg-surface-soft border border-hairline rounded-lg p-5 flex flex-col gap-4 font-sans">
            <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">Program Actions</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsEditCourseModalOpen(true)}
                className="w-full h-9 bg-primary text-on-primary font-medium text-xs rounded-md hover:bg-primary-active flex items-center justify-center transition-colors cursor-pointer"
              >
                Edit Program details
              </button>
              <button
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="w-full h-9 bg-error/10 text-error font-medium text-xs rounded-md hover:bg-error/20 border border-error/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                Delete Program
              </button>
            </div>
          </div>
        </div>
      </PublicLayoutSidebar>

      <div className="bg-canvas w-full font-sans">
        <TabBar
          tabs={[
            { id: "candidates", label: "Enrolled Candidates" },
            { id: "enroll", label: "Enroll Candidates" }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "candidates" && (
          <div className="flex flex-col gap-6">
            <SearchBar
              placeholder="Search enrolled candidates..."
              value={candidateSearch}
              onChange={setCandidateSearch}
            />

            {filteredCandidates.length === 0 ? (
              <EmptyState message="No candidates enrolled in this course registry matching query." title="No Enrolled Candidates" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden text-xs">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Candidate</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">INDOS ID</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Status</th>
                      <th className="px-4 py-3 text-right font-semibold uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {filteredCandidates.map(({ enrollment, seafarer: s }) => {
                      if (!s) return null;
                      return (
                        <tr key={enrollment.id} className="hover:bg-surface-soft/20 transition-colors">
                          <td
                            className="px-4 py-3.5 font-semibold text-body-strong cursor-pointer hover:underline"
                            onClick={() => router.push(`/seafarer/${s.indos}`)}
                          >
                            {s.firstName}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-muted">{s.indos}</td>
                          <td className="px-4 py-3.5">
                            <StatusBadge status={enrollment.status} />
                          </td>
                          <td className="px-4 py-3.5 text-right flex justify-end gap-2">
                            {enrollment.status === "ENROLLED" && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(enrollment, "COMPLETED")}
                                  className="px-2 py-0.5 bg-success/15 hover:bg-success/25 text-success rounded text-[10px] font-bold uppercase cursor-pointer"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => handleStatusChange(enrollment, "CANCELLED")}
                                  className="px-2 py-0.5 bg-error/15 hover:bg-error/25 text-error rounded text-[10px] font-bold uppercase cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "enroll" && (
          <div className="flex flex-col gap-6">
            <SearchBar
              placeholder="Search registry seafarers to enroll..."
              value={enrollSearch}
              onChange={setEnrollSearch}
            />

            {availableSeafarers.length === 0 ? (
              <EmptyState message="No un-enrolled seafarers match search criteria." title="No Available Seafarers" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden text-xs">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Name</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">INDOS ID</th>
                      <th className="px-4 py-3 text-right font-semibold uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {availableSeafarers.map((s) => (
                      <tr key={s.id} className="hover:bg-surface-soft/20 transition-colors">
                        <td
                          className="px-4 py-3.5 font-semibold text-body-strong cursor-pointer hover:underline"
                          onClick={() => router.push(`/seafarer/${s.indos}`)}
                        >
                          {s.firstName}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-muted">{s.indos}</td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => handleEnrollCandidate(s.id)}
                            className="px-3.5 py-1.5 bg-primary text-on-primary rounded text-[10px] font-bold uppercase transition-colors hover:bg-primary-active cursor-pointer"
                          >
                            Enroll Candidate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Program details Modal */}
      <Modal
        isOpen={isEditCourseModalOpen}
        onClose={() => setIsEditCourseModalOpen(false)}
        title="Edit Program details"
        subtitle="Modify program curriculum details."
      >
        <form onSubmit={handleUpdateCourse} className="flex flex-col gap-4 text-xs font-sans">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">PROGRAM CURRICULUM NAME</label>
            <input
              type="text"
              value={editCourseForm.name}
              onChange={(e) => setEditCourseForm({ ...editCourseForm, name: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">ACADEMIC START DATE</label>
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
              id="edit-col-course-isActive"
              checked={editCourseForm.isActive}
              onChange={(e) => setEditCourseForm({ ...editCourseForm, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
            />
            <label htmlFor="edit-col-course-isActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
              ACTIVE PROGRAM LISTING
            </label>
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsEditCourseModalOpen(false)}
              className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer disabled:opacity-50 font-semibold"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Program Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDeleteCourse}
        title="Delete Program"
        message="Are you sure you want to delete this program registry? This will clear all records associated."
        confirmLabel="Confirm Deletion"
        isDestructive={true}
      />
    </>
  );
}
