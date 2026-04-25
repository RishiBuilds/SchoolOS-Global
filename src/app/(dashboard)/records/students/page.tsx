"use client";

import { useState, useEffect } from "react";
import { Users, Search, Download } from "lucide-react";
import { PageHeader } from "@/components/ui/shared";
import { toast } from "sonner";
import { getInitials, cn } from "@/lib/utils";

export default function StudentRecordsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([fetch("/api/students").then(r => r.json()), fetch("/api/classes").then(r => r.json())])
      .then(([s, c]) => { setStudents(s); setClasses(c); })
      .catch(() => toast.error("Failed")).finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s => {
    const matchSearch = !search || `${s.firstName} ${s.lastName} ${s.admissionNo}`.toLowerCase().includes(search.toLowerCase());
    const matchClass = !classFilter || s.class?.name === classFilter;
    return matchSearch && matchClass;
  });

  const genderColors: Record<string, string> = { MALE: "bg-primary/10 text-primary", FEMALE: "bg-violet-50 text-violet-600", OTHER: "bg-emerald-50 text-emerald-600" };

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader title="Student Details" description="View and search student records" icon={Users} />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-border text-text-primary placeholder:text-text-muted text-sm" />
        </div>
        <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="px-4 py-2.5 rounded-lg bg-white border border-border text-text-primary text-sm">
          <option value="">All Classes</option>
          {[...new Set(classes.map((c: any) => c.name))].map(n => <option key={n as string} value={n as string}>{n as string}</option>)}
        </select>
      </div>
      {loading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div> : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                {["Student", "Admission No", "Class", "Gender", "Parent", "Phone"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-border/50 table-row-hover">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{getInitials(`${s.firstName} ${s.lastName}`)}</div><span className="text-sm font-medium text-text-primary">{s.firstName} {s.lastName}</span></div></td>
                    <td className="px-4 py-3 text-sm font-mono text-text-violet-600">{s.admissionNo}</td>
                    <td className="px-4 py-3 text-sm text-text-violet-600">{s.class?.name}{s.class?.section && ` — ${s.class.section}`}</td>
                    <td className="px-4 py-3"><span className={cn("inline-flex px-2 py-0.5 rounded-md text-xs font-medium", genderColors[s.gender])}>{s.gender}</span></td>
                    <td className="px-4 py-3 text-sm text-text-violet-600">{s.parentName}</td>
                    <td className="px-4 py-3 text-sm text-text-violet-600">{s.parentPhone || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border"><p className="text-xs text-text-muted">Total: {filtered.length} students</p></div>
        </div>
      )}
    </div>
  );
}
