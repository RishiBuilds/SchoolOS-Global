"use client";

import { useState, useEffect } from "react";
import { IndianRupee, Search, Receipt } from "lucide-react";
import { PageHeader } from "@/components/ui/shared";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";

export default function FeeLedgerPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    fetch(`/api/fees/payments?${params}`)
      .then((r) => r.json())
      .then(setPayments)
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const filtered = payments.filter((p) => {
    if (!search) return true;
    const name = `${p.student.firstName} ${p.student.lastName} ${p.student.admissionNo}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const totalCollected = filtered.reduce((s, p) => s + p.amountPaid, 0);

  const statusStyles: Record<string, string> = {
    PAID: "bg-emerald-50 text-emerald-600",
    PARTIAL: "bg-amber-50 text-amber-600",
    PENDING: "bg-red-50 text-red-500",
    OVERDUE: "bg-red-100 text-red-600",
  };

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader title="Fee Ledger" description="Complete payment history and records" icon={Receipt} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-border border-l-[3px] border-l-emerald-500 p-4">
          <p className="text-xs text-text-muted">Total Collected</p>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">₹{totalCollected.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white rounded-xl border border-border border-l-[3px] border-l-primary p-4">
          <p className="text-xs text-text-muted">Total Payments</p>
          <p className="text-xl font-bold text-text-primary mt-0.5">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-border border-l-[3px] border-l-amber-500 p-4">
          <p className="text-xs text-text-muted">Partial Payments</p>
          <p className="text-xl font-bold text-amber-600 mt-0.5">{filtered.filter(p => p.status === "PARTIAL").length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" placeholder="Search by student name..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-border text-text-primary placeholder:text-text-muted text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-white border border-border text-text-primary text-sm">
          <option value="">All Status</option>
          <option value="PAID">Paid</option>
          <option value="PARTIAL">Partial</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Student", "Class", "Fee Type", "Amount", "Method", "Receipt", "Date", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 table-row-hover">
                    <td className="px-4 py-3 text-sm font-medium text-text-primary">{p.student.firstName} {p.student.lastName}</td>
                    <td className="px-4 py-3 text-sm text-text-violet-600">{p.student.class?.name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-text-violet-600">{p.feeStructure.name}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-emerald-600">₹{p.amountPaid.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-sm text-text-violet-600">{p.paymentMethod || "—"}</td>
                    <td className="px-4 py-3 text-xs font-mono text-text-muted">{p.receiptNo}</td>
                    <td className="px-4 py-3 text-sm text-text-violet-600">{formatDate(p.paymentDate)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2.5 py-0.5 rounded-md text-xs font-medium", statusStyles[p.status])}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border">
            <p className="text-xs text-text-muted">Showing {filtered.length} payments</p>
          </div>
        </div>
      )}
    </div>
  );
}
