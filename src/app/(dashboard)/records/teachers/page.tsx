"use client";

import { useState, useEffect } from "react";
import { UserCheck, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/shared";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";

export default function TeacherRecordsPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/teachers").then(r => r.json()).then(setTeachers).catch(() => toast.error("Failed")).finally(() => setLoading(false));
  }, []);

  const filtered = teachers.filter(t => !search || `${t.firstName} ${t.lastName} ${t.employeeId}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader title="Teacher Records" description="View teacher profiles and details" icon={UserCheck} />
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input type="text" placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-border text-text-primary placeholder:text-text-muted text-sm" />
      </div>
      {loading ? <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div> : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                {["Teacher", "Employee ID", "Email", "Qualification", "Specialization", "Phone"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-b border-border/50 table-row-hover">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 text-xs font-bold">{getInitials(`${t.firstName} ${t.lastName}`)}</div><span className="text-sm font-medium text-text-primary">{t.firstName} {t.lastName}</span></div></td>
                    <td className="px-4 py-3 text-sm font-mono text-text-violet-600">{t.employeeId}</td>
                    <td className="px-4 py-3 text-sm text-text-violet-600">{t.email}</td>
                    <td className="px-4 py-3 text-sm text-text-violet-600">{t.qualification}</td>
                    <td className="px-4 py-3 text-sm text-text-violet-600">{t.specialization || "—"}</td>
                    <td className="px-4 py-3 text-sm text-text-violet-600">{t.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border"><p className="text-xs text-text-muted">Total: {filtered.length} teachers</p></div>
        </div>
      )}
    </div>
  );
}
