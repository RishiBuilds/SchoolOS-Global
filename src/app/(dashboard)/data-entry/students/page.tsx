"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Filter,
} from "lucide-react";
import { PageHeader, Button, EmptyState } from "@/components/ui/shared";
import { toast } from "sonner";
import { cn, formatDate, getInitials } from "@/lib/utils";

interface StudentItem {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string | null;
  email: string | null;
  parentName: string;
  class: { name: string; section: string | null };
  isActive: boolean;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/students").then((r) => r.json()),
      fetch("/api/classes").then((r) => r.json()),
    ])
      .then(([studs, cls]) => {
        setStudents(studs);
        setClasses(cls);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    setDeleteId(id);
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        toast.success("Student deleted successfully");
      } else {
        toast.error("Failed to delete student");
      }
    } catch {
      toast.error("Failed to delete student");
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = students.filter((s) => {
    const matchSearch =
      !search ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(search.toLowerCase());
    const matchClass = !classFilter || s.class.name === classFilter;
    return matchSearch && matchClass;
  });

  const genderColors: Record<string, string> = {
    MALE: "bg-primary/10 text-primary",
    FEMALE: "bg-violet-50 text-violet-600",
    OTHER: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader
        title="Student Setup"
        description="Manage student enrollments and profiles"
        icon={Users}
        action={
          <Link href="/data-entry/students/new">
            <Button>
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name or admission no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-border text-text-primary placeholder:text-text-muted text-sm"
          />
        </div>
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-white border border-border text-text-primary text-sm"
        >
          <option value="">All Classes</option>
          {[...new Set(classes.map((c: any) => c.name))].map((name) => (
            <option key={name as string} value={name as string}>
              {name as string}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description="Add your first student to get started"
          action={
            <Link href="/data-entry/students/new">
              <Button>
                <Plus className="w-4 h-4" />
                Add Student
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Student
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Admission No
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Class
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Gender
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Parent
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-border/50 table-row-hover transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                          {getInitials(
                            `${student.firstName} ${student.lastName}`
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {student.firstName} {student.lastName}
                          </p>
                          {student.phone && (
                            <p className="text-xs text-text-muted">
                              {student.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-text-violet-600">
                        {student.admissionNo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-violet-600">
                        {student.class.name}
                        {student.class.section &&
                          ` — ${student.class.section}`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex px-2 py-0.5 rounded-md text-xs font-medium",
                          genderColors[student.gender] || "bg-bg-input text-text-muted"
                        )}
                      >
                        {student.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-violet-600">
                        {student.parentName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/data-entry/students/${student.id}/edit`}>
                          <button className="p-1.5 rounded-lg hover:bg-bg-muted text-text-muted hover:text-primary transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(student.id)}
                          disabled={deleteId === student.id}
                          className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-colors disabled:opacity-50"
                        >
                          {deleteId === student.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border">
            <p className="text-xs text-text-muted">
              Showing {filtered.length} of {students.length} students
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
