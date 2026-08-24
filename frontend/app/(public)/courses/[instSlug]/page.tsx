"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAllInstitutes,
  getAllCourses,
  getAllEnrollments,
  getAllIndos,
  createCourse,
  updateEnrollment,
  updateInstitute,
  deleteInstitute,
  toSlug,
  InstituteResponseDTO,
  InstituteRequestDTO,
  PreSeaCoursesResponseDTO,
  EnrollmentResponseDTO,
  IndosMasterResponseDTO,
  PreSeaCoursesRequestDTO
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../../PublicLayoutClient";
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

type TabId = "courses" | "candidates";

export default function InstituteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const instSlug = params.instSlug as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolved Institute info
  const [institute, setInstitute] = useState<InstituteResponseDTO | null>(null);
  const [id, setId] = useState<string | null>(null);

  // Collections
  const [courses, setCourses] = useState<PreSeaCoursesResponseDTO[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentResponseDTO[]>([]);
  const [seafarers, setSeafarers] = useState<IndosMasterResponseDTO[]>([]);

  // Navigation / Tab state
  const [activeTab, setActiveTab] = useState<TabId>("courses");

  // Search, modals, forms for Course management
  const [courseSearch, setCourseSearch] = useState("");
  const [candidateSearch, setCandidateSearch] = useState("");
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const [courseForm, setCourseForm] = useState<PreSeaCoursesRequestDTO>({
    name: "",
    isActive: true,
    startDate: new Date().toISOString().split("T")[0],
    instituteId: ""
  });

  // Institute Edit / Delete States
  const [isEditInstModalOpen, setIsEditInstModalOpen] = useState(false);
  const [editInstForm, setEditInstForm] = useState<InstituteRequestDTO>({ name: "" });
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [saving, setSaving] = useState(false);

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
      setEditInstForm({ name: foundInst.name });

      // Filter courses for this institute
      const instCourses = allCourses.filter((c) => c.instituteId === instId);
      setCourses(instCourses);

      // Filter enrollments for this institute's courses
      const instEnrollments = allEnrollments.filter((e) =>
        instCourses.some((c) => c.id === e.preSeaCourseId)
      );
      setEnrollments(instEnrollments);
      setSeafarers(allSeafarers);
    } catch (err: any) {
      console.error("Failed to load institute details", err);
      setError("Failed to query institute records from backend registries.");
      toast("Error loading institute details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (instSlug) {
      loadData();
    }
  }, [instSlug]);

  const handleEditInstitute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !institute) return;

    if (!editInstForm.name.trim()) {
      toast("Institute name is required.", "warning");
      return;
    }

    setSaving(true);
    try {
      await updateInstitute(id, { name: editInstForm.name.trim() });
      toast("Institute information updated successfully.", "success");
      const newSlug = toSlug(editInstForm.name.trim());
      setIsEditInstModalOpen(false);
      router.push(`/courses/${newSlug}`);
    } catch (err: any) {
      toast(err.message || "Failed to update institute details.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteInstitute = async () => {
    if (!id) return;
    try {
      await deleteInstitute(id);
      toast("Institute deleted successfully.", "success");
      router.push("/courses");
    } catch (err: any) {
      toast(err.message || "Failed to delete institute.", "error");
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!courseForm.name.trim()) {
      toast("Course name is required.", "warning");
      return;
    }

    setSaving(true);
    try {
      const newCourse = await createCourse({
        name: courseForm.name.trim(),
        isActive: courseForm.isActive,
        startDate: courseForm.startDate,
        instituteId: id
      });
      toast("Course registered successfully under this college.", "success");
      setCourses((prev) => [...prev, newCourse]);
      setCourseForm({
        name: "",
        isActive: true,
        startDate: new Date().toISOString().split("T")[0],
        instituteId: ""
      });
      setIsCourseModalOpen(false);
    } catch (err: any) {
      toast(err.message || "Failed to create course.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (enrollmentId: string, newStatus: "COMPLETED" | "CANCELLED") => {
    try {
      const found = enrollments.find(e => e.id === enrollmentId);
      if (!found) return;

      await updateEnrollment(enrollmentId, {
        preSeaCourseId: found.preSeaCourseId,
        indosMasterId: found.indosMasterId,
        status: newStatus,
        remarks: found.remarks
      });

      toast(`Candidate status changed to ${newStatus}.`, "success");
      const allEnrollments = await getAllEnrollments();
      const instEnrollments = allEnrollments.filter((e) =>
        courses.some((c) => c.id === e.preSeaCourseId)
      );
      setEnrollments(instEnrollments);
    } catch (err: any) {
      toast(err.message || "Failed to update enrollment status.", "error");
    }
  };

  const getSeafarerInfo = (seafarerId: string) => {
    return seafarers.find(s => s.id === seafarerId);
  };

  if (loading) {
    return <LoadingSkeleton rows={4} type="table" />;
  }

  if (error || !institute) {
    return (
      <EmptyState
        message={error || "College information could not be resolved."}
        title="College Profile Error"
        ctaLabel="Back to Colleges"
        onCtaClick={() => router.push("/courses")}
      />
    );
  }

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const filteredCandidates = enrollments
    .map(e => {
      const s = getSeafarerInfo(e.indosMasterId);
      const c = courses.find(cr => cr.id === e.preSeaCourseId);
      return { enrollment: e, seafarer: s, course: c };
    })
    .filter(item => {
      if (!item.seafarer) return false;
      const searchStr = candidateSearch.toLowerCase();
      const matchesName = item.seafarer.firstName.toLowerCase().includes(searchStr);
      const matchesIndos = item.seafarer.indos.toLowerCase().includes(searchStr);
      const matchesCourse = item.course?.name.toLowerCase().includes(searchStr) || false;
      return matchesName || matchesIndos || matchesCourse;
    });

  return (
    <>
      <PublicLayoutHeader deps={[id, institute.name]}>
        <PageHeader
          title={institute.name}
          subtitle="Maritime Training Academy detail dashboard."
          backHref="/courses"
          backLabel="Back to Courses"
        />
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[activeTab]}>
        <div className="flex flex-col gap-6 mt-4">
          <nav className="flex flex-col gap-1.5 font-sans">
            <button
              onClick={() => setActiveTab("courses")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeTab === "courses"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Nautical Programs
            </button>
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
          </nav>

          <div className="bg-surface-soft border border-hairline rounded-lg p-5 flex flex-col gap-4 font-sans">
            <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">College Actions</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsEditInstModalOpen(true)}
                className="w-full h-9 bg-primary text-on-primary font-medium text-xs rounded-md hover:bg-primary-active flex items-center justify-center transition-colors cursor-pointer"
              >
                Edit College Name
              </button>
              <button
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="w-full h-9 bg-error/10 text-error font-medium text-xs rounded-md hover:bg-error/20 border border-error/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                Delete College
              </button>
            </div>
          </div>
        </div>
      </PublicLayoutSidebar>

      <div className="bg-canvas w-full font-sans">
        <TabBar
          tabs={[
            { id: "courses", label: "Program Listings" },
            { id: "candidates", label: "Enrolled Candidates" }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "courses" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-grow">
                <SearchBar
                  placeholder="Search programs under this college..."
                  value={courseSearch}
                  onChange={setCourseSearch}
                />
              </div>
              <button
                onClick={() => setIsCourseModalOpen(true)}
                className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs tracking-wide uppercase transition-colors cursor-pointer flex-shrink-0"
              >
                Register Program
              </button>
            </div>

            {filteredCourses.length === 0 ? (
              <EmptyState message="No programs found under this college." title="No Programs" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden text-xs">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Program Name</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Start Date</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {filteredCourses.map((c) => (
                      <tr key={c.id} className="hover:bg-surface-soft/20 transition-colors">
                        <td
                          className="px-4 py-3.5 font-semibold text-body-strong cursor-pointer hover:underline"
                          onClick={() => router.push(`/courses/${instSlug}/${toSlug(c.name)}`)}
                        >
                          {c.name}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-muted">{c.startDate}</td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={c.isActive ? "true" : "false"} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "candidates" && (
          <div className="flex flex-col gap-6">
            <SearchBar
              placeholder="Search candidates by name, INDOS registry or course..."
              value={candidateSearch}
              onChange={setCandidateSearch}
            />

            {filteredCandidates.length === 0 ? (
              <EmptyState message="No candidates enrolled in programs under this college." title="No Candidates" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden text-xs">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Candidate</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">INDOS ID</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Program</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Status</th>
                      <th className="px-4 py-3 text-right font-semibold uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {filteredCandidates.map(({ enrollment, seafarer: s, course: c }) => {
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
                          <td className="px-4 py-3.5 text-body-text">{c?.name || "—"}</td>
                          <td className="px-4 py-3.5">
                            <StatusBadge status={enrollment.status} />
                          </td>
                          <td className="px-4 py-3.5 text-right flex justify-end gap-2">
                            {enrollment.status === "ENROLLED" && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(enrollment.id, "COMPLETED")}
                                  className="px-2 py-0.5 bg-success/15 hover:bg-success/25 text-success rounded text-[10px] font-bold uppercase cursor-pointer"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => handleStatusChange(enrollment.id, "CANCELLED")}
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
      </div>

      {/* Edit College name Modal */}
      <Modal
        isOpen={isEditInstModalOpen}
        onClose={() => setIsEditInstModalOpen(false)}
        title="Edit College name"
        subtitle="Modify register name of this institute."
      >
        <form onSubmit={handleEditInstitute} className="flex flex-col gap-4 text-xs font-sans">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">TRAINING COLLEGE REGISTERED NAME</label>
            <input
              type="text"
              value={editInstForm.name}
              onChange={(e) => setEditInstForm({ name: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            />
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsEditInstModalOpen(false)}
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

      {/* Register Program Modal */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title="Register Program"
        subtitle="Add a pre-sea curriculum to this college."
      >
        <form onSubmit={handleCreateCourse} className="flex flex-col gap-4 text-xs font-sans">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">PROGRAM CURRICULUM NAME</label>
            <input
              type="text"
              placeholder="e.g. Diploma in Nautical Science"
              value={courseForm.name}
              onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">ACADEMIC START DATE</label>
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
              id="col-course-isActive"
              checked={courseForm.isActive}
              onChange={(e) => setCourseForm({ ...courseForm, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
            />
            <label htmlFor="col-course-isActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
              ACTIVE PROGRAM LISTING
            </label>
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsCourseModalOpen(false)}
              className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer disabled:opacity-50 font-semibold"
            >
              {saving ? "Registering..." : "Save Program"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete College Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDeleteInstitute}
        title="Delete Training College"
        message="Are you sure you want to delete this training college? This will clear all records and curriculum lists associated."
        confirmLabel="Confirm Deletion"
        isDestructive={true}
      />
    </>
  );
}
