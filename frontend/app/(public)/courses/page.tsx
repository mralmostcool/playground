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
import {
  PageHeader,
  SearchBar,
  Pagination,
  LoadingSkeleton,
  EmptyState,
  Modal,
  ConfirmDialog,
  StatusBadge,
  TabBar,
  useToast
} from "@/components/ui";

type TabId = "institutes" | "courses";

export default function CoursesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("institutes");

  // Core Collections
  const [courses, setCourses] = useState<PreSeaCoursesResponseDTO[]>([]);
  const [institutes, setInstitutes] = useState<InstituteResponseDTO[]>([]);

  // Search States
  const [courseSearch, setCourseSearch] = useState("");
  const [instituteSearch, setInstituteSearch] = useState("");
  const [selectedInstituteId, setSelectedInstituteId] = useState<string>("");

  // Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isInstituteModalOpen, setIsInstituteModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<PreSeaCoursesResponseDTO | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

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
      toast("Error syncing data from backend", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getActiveCoursesCount = (instId: string) => {
    return courses.filter((c) => c.instituteId === instId && c.isActive).length;
  };

  const handleCreateInstitute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instForm.name.trim()) {
      toast("Institute name is required.", "warning");
      return;
    }
    setSaving(true);
    try {
      const newInst = await createInstitute({ name: instForm.name.trim() });
      toast("Training institute registered successfully.", "success");
      setInstitutes((prev) => [...prev, newInst]);
      setInstForm({ name: "" });
      setIsInstituteModalOpen(false);
    } catch (err: any) {
      toast(err.message || "Failed to create institute.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.name.trim()) {
      toast("Course name is required.", "warning");
      return;
    }
    if (!courseForm.instituteId) {
      toast("Assigned institute is required.", "warning");
      return;
    }
    setSaving(true);
    try {
      const newCourse = await createCourse({
        name: courseForm.name.trim(),
        isActive: courseForm.isActive,
        startDate: courseForm.startDate,
        instituteId: courseForm.instituteId
      });
      toast("Pre-Sea course program registered.", "success");
      setCourses((prev) => [...prev, newCourse]);
      setCourseForm({
        name: "",
        isActive: true,
        startDate: new Date().toISOString().split("T")[0],
        instituteId: ""
      });
      setIsCourseModalOpen(false);
    } catch (err: any) {
      toast(err.message || "Failed to register course program.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    if (!editCourseForm.name.trim()) {
      toast("Course name is required.", "warning");
      return;
    }
    setSaving(true);
    try {
      const updated = await updateCourse(selectedCourse.id, {
        name: editCourseForm.name.trim(),
        isActive: editCourseForm.isActive,
        startDate: editCourseForm.startDate,
        instituteId: editCourseForm.instituteId || selectedCourse.instituteId
      });
      toast("Course details updated.", "success");
      setCourses((prev) => prev.map((c) => (c.id === selectedCourse.id ? updated : c)));
      setIsEditCourseModalOpen(false);
      setSelectedCourse(null);
    } catch (err: any) {
      toast(err.message || "Failed to save course changes.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!deletingCourseId) return;
    try {
      await deleteCourse(deletingCourseId);
      toast("Course program deleted successfully.", "success");
      setCourses((prev) => prev.filter((c) => c.id !== deletingCourseId));
    } catch (err: any) {
      toast(err.message || "Failed to delete course.", "error");
    } finally {
      setDeletingCourseId(null);
    }
  };

  // Filtered views
  const filteredInstitutes = institutes.filter((inst) =>
    inst.name.toLowerCase().includes(instituteSearch.toLowerCase())
  );

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesInst = selectedInstituteId ? c.instituteId === selectedInstituteId : true;
    return matchesSearch && matchesInst;
  });

  return (
    <>
      <PublicLayoutHeader deps={[activeTab]}>
        <PageHeader
          title="Nautical Programs"
          subtitle="Query academic listings, pre-sea maritime directories, and certified training colleges."
        />
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[activeTab]}>
        <div className="flex flex-col gap-6 mt-4">
          <button
            onClick={() => {
              if (activeTab === "institutes") {
                setIsInstituteModalOpen(true);
              } else {
                setIsCourseModalOpen(true);
              }
            }}
            className="w-full h-10 bg-primary text-on-primary font-medium text-xs tracking-wide uppercase rounded-md hover:bg-primary-active flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {activeTab === "institutes" ? "Add Institute" : "Register Course"}
          </button>
        </div>
      </PublicLayoutSidebar>

      <div className="flex flex-col gap-6 w-full font-sans">
        <TabBar
          tabs={[
            { id: "institutes", label: "Training Colleges" },
            { id: "courses", label: "Program Listings" }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {loading ? (
          <LoadingSkeleton rows={5} type="table" />
        ) : error ? (
          <EmptyState message={error} title="Database Registry Error" />
        ) : (
          <>
            {activeTab === "institutes" ? (
              <div className="flex flex-col gap-6">
                <SearchBar
                  placeholder="Search colleges by name..."
                  value={instituteSearch}
                  onChange={setInstituteSearch}
                />

                {filteredInstitutes.length === 0 ? (
                  <EmptyState message="No maritime colleges registered in directory." title="No Colleges Found" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInstitutes.map((inst) => {
                      const count = getActiveCoursesCount(inst.id);
                      return (
                        <div
                          key={inst.id}
                          onClick={() => router.push(`/courses/${toSlug(inst.name)}`)}
                          className="group p-6 bg-surface-card hover:bg-canvas border border-hairline hover:border-primary rounded-xl transition-all duration-300 text-left shadow-xs hover:shadow-md cursor-pointer hover:-translate-y-0.5 flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-xs font-mono text-muted uppercase tracking-wider block mb-1">Academy</span>
                            <h3 className="text-md font-serif text-ink mb-3 group-hover:text-primary transition-colors">
                              {inst.name}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between border-t border-hairline-soft pt-4 mt-2">
                            <span className="text-[11px] text-muted">Active Programs</span>
                            <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                              {count}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <SearchBar
                      placeholder="Search nautical programs by name..."
                      value={courseSearch}
                      onChange={setCourseSearch}
                    />
                  </div>
                  <select
                    value={selectedInstituteId}
                    onChange={(e) => setSelectedInstituteId(e.target.value)}
                    className="h-10 text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm w-full sm:w-64"
                  >
                    <option value="">Filter by College (All)</option>
                    {institutes.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>

                {filteredCourses.length === 0 ? (
                  <EmptyState message="No nautical programs matches your selection criteria." title="No Programs Found" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden text-xs">
                      <thead>
                        <tr className="bg-surface-soft border-b border-hairline text-muted">
                          <th className="px-4 py-3 text-left font-semibold uppercase">Program Name</th>
                          <th className="px-4 py-3 text-left font-semibold uppercase">Maritime College</th>
                          <th className="px-4 py-3 text-left font-semibold uppercase">Start Date</th>
                          <th className="px-4 py-3 text-left font-semibold uppercase">Status</th>
                          <th className="px-4 py-3 text-right font-semibold uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline-soft">
                        {filteredCourses.map((c) => {
                          const instName = institutes.find((i) => i.id === c.instituteId)?.name ?? "Unknown Partner";
                          return (
                            <tr key={c.id} className="hover:bg-surface-soft/20 transition-colors">
                              <td
                                className="px-4 py-3.5 font-semibold text-body-strong cursor-pointer hover:underline"
                                onClick={() => router.push(`/courses/${toSlug(instName)}/${toSlug(c.name)}`)}
                              >
                                {c.name}
                              </td>
                              <td className="px-4 py-3.5 text-body-text">{instName}</td>
                              <td className="px-4 py-3.5 font-mono text-muted">{c.startDate}</td>
                              <td className="px-4 py-3.5">
                                <StatusBadge status={c.isActive ? "true" : "false"} />
                              </td>
                              <td className="px-4 py-3.5 text-right flex items-center justify-end gap-3">
                                <button
                                  onClick={() => {
                                    setSelectedCourse(c);
                                    setEditCourseForm({
                                      name: c.name,
                                      isActive: c.isActive,
                                      startDate: c.startDate,
                                      instituteId: c.instituteId || ""
                                    });
                                    setIsEditCourseModalOpen(true);
                                  }}
                                  className="text-primary hover:underline font-semibold cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => setDeletingCourseId(c.id)}
                                  className="text-error hover:underline font-semibold cursor-pointer"
                                >
                                  Delete
                                </button>
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
          </>
        )}
      </div>

      {/* Add Institute Modal */}
      <Modal
        isOpen={isInstituteModalOpen}
        onClose={() => setIsInstituteModalOpen(false)}
        title="Add Training Institute"
        subtitle="Register a new academic partner college."
      >
        <form onSubmit={handleCreateInstitute} className="flex flex-col gap-4 text-xs font-sans">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">INSTITUTE COLLEGE NAME</label>
            <input
              type="text"
              placeholder="e.g. Maritime Training College"
              value={instForm.name}
              onChange={(e) => setInstForm({ name: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            />
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsInstituteModalOpen(false)}
              className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer disabled:opacity-50 font-semibold"
            >
              {saving ? "Registering..." : "Save Institute"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Register Course Modal */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title="Register Course Program"
        subtitle="Add a pre-sea certification curriculum registry."
      >
        <form onSubmit={handleCreateCourse} className="flex flex-col gap-4 text-xs font-sans">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">PROGRAM CURRICULUM NAME</label>
            <input
              type="text"
              placeholder="e.g. B.Sc. Nautical Studies"
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

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">TRAINING COLLEGE PARTNER</label>
            <select
              value={courseForm.instituteId}
              onChange={(e) => setCourseForm({ ...courseForm, instituteId: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            >
              <option value="">Select College Options</option>
              {institutes.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="course-isActive"
              checked={courseForm.isActive}
              onChange={(e) => setCourseForm({ ...courseForm, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
            />
            <label htmlFor="course-isActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
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

      {/* Edit Course Modal */}
      {selectedCourse && (
        <Modal
          isOpen={isEditCourseModalOpen}
          onClose={() => {
            setIsEditCourseModalOpen(false);
            setSelectedCourse(null);
          }}
          title="Edit Course details"
          subtitle="Modify pre-sea curriculum metadata."
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

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-body-strong">TRAINING COLLEGE PARTNER</label>
              <select
                value={editCourseForm.instituteId}
                onChange={(e) => setEditCourseForm({ ...editCourseForm, instituteId: e.target.value })}
                className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                style={{ height: "40px" }}
              >
                {institutes.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="edit-course-isActive"
                checked={editCourseForm.isActive}
                onChange={(e) => setEditCourseForm({ ...editCourseForm, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
              />
              <label htmlFor="edit-course-isActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
                ACTIVE PROGRAM LISTING
              </label>
            </div>

            <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditCourseModalOpen(false);
                  setSelectedCourse(null);
                }}
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
      )}

      {/* Delete Course Confirm Dialog */}
      <ConfirmDialog
        isOpen={deletingCourseId !== null}
        onClose={() => setDeletingCourseId(null)}
        onConfirm={handleDeleteCourse}
        title="Delete Course Program"
        message="Are you sure you want to delete this course program registry? This will clear all entries from databases."
        confirmLabel="Confirm Deletion"
        isDestructive={true}
      />
    </>
  );
}
