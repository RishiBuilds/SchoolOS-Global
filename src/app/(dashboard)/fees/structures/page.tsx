"use client";

import { useState, useEffect } from "react";
import {
  IndianRupee,
  Plus,
  Trash2,
  Loader2,
  School,
  Calendar,
} from "lucide-react";
import { PageHeader, Button, EmptyState } from "@/components/ui/shared";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function FeeStructuresPage() {
  const [structures, setStructures] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    amount: "",
    classId: "",
    dueDate: "",
    description: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/fees/structures").then((r) => r.json()),
      fetch("/api/classes").then((r) => r.json()),
    ])
      .then(([s, c]) => {
        setStructures(s);
        setClasses(c);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.amount || !form.classId) {
      toast.error("Please fill all required fields");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/fees/structures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const created = await res.json();
        setStructures((prev) => [created, ...prev]);
        setForm({ name: "", amount: "", classId: "", dueDate: "", description: "" });
        setShowForm(false);
        toast.success("Fee structure created");
      } else {
        toast.error("Failed to create fee structure");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const totalAmount = structures.reduce((s, f) => s + f.amount, 0);

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader
        title="Fee Structures"
        description="Define and manage fee types for each class"
        icon={IndianRupee}
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4" />
            {showForm ? "Cancel" : "Add Fee Type"}
          </Button>
        }
      />

      {/* Add Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-border p-5 animate-slideDown"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">
                Fee Name <span className="text-danger">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Tuition Fee"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">
                Amount (₹) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="e.g. 15000"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">
                Class <span className="text-danger">*</span>
              </label>
              <select
                value={form.classId}
                onChange={(e) => setForm({ ...form, classId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary text-sm"
              >
                <option value="">Select class</option>
                {classes.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.section ? ` — ${c.section}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">
                Description
              </label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {saving ? "Creating..." : "Create Fee"}
            </Button>
          </div>
        </form>
      )}

      {/* Summary */}
      {structures.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-border border-l-[3px] border-l-primary p-4">
            <p className="text-xs text-text-muted">Total Fee Types</p>
            <p className="text-xl font-bold text-text-primary mt-0.5">{structures.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-border border-l-[3px] border-l-emerald-500 p-4">
            <p className="text-xs text-text-muted">Total Fee Value</p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">
              ₹{totalAmount.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-border border-l-[3px] border-l-violet-500 p-4">
            <p className="text-xs text-text-muted">Classes Covered</p>
            <p className="text-xl font-bold text-violet-600 mt-0.5">
              {new Set(structures.map((s) => s.classId)).size}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : structures.length === 0 ? (
        <EmptyState
          icon={IndianRupee}
          title="No fee structures yet"
          description="Create fee types to start collecting fees"
          action={
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" />
              Add Fee Type
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Fee Name", "Amount", "Class", "Due Date", "Payments"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {structures.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-border/50 table-row-hover"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <IndianRupee className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {s.name}
                          </p>
                          {s.description && (
                            <p className="text-[11px] text-text-muted">
                              {s.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-emerald-600">
                        ₹{s.amount.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-violet-600">
                      {s.class.name}
                      {s.class.section && ` — ${s.class.section}`}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-violet-600">
                      {s.dueDate ? formatDate(s.dueDate) : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-violet-600">
                      {s._count.payments}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
