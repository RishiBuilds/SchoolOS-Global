"use client";

import { useState, useEffect } from "react";
import { IndianRupee, Loader2, Save, Receipt } from "lucide-react";
import { PageHeader, Button } from "@/components/ui/shared";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CollectFeesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedFee, setSelectedFee] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/classes").then(r => r.json()),
      fetch("/api/fees/structures").then(r => r.json()),
      fetch("/api/fees/payments").then(r => r.json()),
    ]).then(([c, f, p]) => {
      setClasses(c); setFeeStructures(f); setRecentPayments(p.slice(0, 10));
    }).catch(() => toast.error("Failed to load data"));
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetch(`/api/students?classId=${selectedClass}`)
        .then(r => r.json()).then(setStudents)
        .catch(() => toast.error("Failed to load students"));
    } else { setStudents([]); }
  }, [selectedClass]);

  const classFeesAvailable = feeStructures.filter(f => f.classId === selectedClass);

  useEffect(() => {
    if (selectedFee) {
      const fee = feeStructures.find(f => f.id === selectedFee);
      if (fee) setAmount(fee.amount.toString());
    }
  }, [selectedFee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedFee || !amount) { toast.error("Fill required fields"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/fees/payments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent, feeStructureId: selectedFee, amountPaid: amount, paymentMethod, remarks }),
      });
      if (res.ok) {
        const payment = await res.json();
        setRecentPayments(prev => [payment, ...prev].slice(0, 10));
        setSelectedStudent(""); setSelectedFee(""); setAmount(""); setRemarks("");
        toast.success(`Payment recorded! Receipt: ${payment.receiptNo}`);
      } else toast.error("Failed to record payment");
    } catch { toast.error("Something went wrong"); }
    finally { setSaving(false); }
  };

  const statusStyles: Record<string, string> = {
    PAID: "bg-emerald-50 text-emerald-600", PARTIAL: "bg-amber-50 text-amber-600",
    PENDING: "bg-red-50 text-red-500", OVERDUE: "bg-red-100 text-red-600",
  };

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader title="Collect Fees" description="Record fee payments from students" icon={Receipt} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-5 space-y-4 sticky top-20">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" />Record Payment
            </h3>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">Class <span className="text-danger">*</span></label>
              <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedStudent(""); setSelectedFee(""); }}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary text-sm">
                <option value="">Select class</option>
                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}{c.section ? ` — ${c.section}` : ""}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">Student <span className="text-danger">*</span></label>
              <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} disabled={!selectedClass}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary text-sm">
                <option value="">Select student</option>
                {students.map((s: any) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNo})</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">Fee Type <span className="text-danger">*</span></label>
              <select value={selectedFee} onChange={e => setSelectedFee(e.target.value)} disabled={!selectedClass}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary text-sm">
                <option value="">Select fee</option>
                {classFeesAvailable.map((f: any) => <option key={f.id} value={f.id}>{f.name} — ₹{f.amount.toLocaleString("en-IN")}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">Amount (₹) <span className="text-danger">*</span></label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">Payment Method</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary text-sm">
                {["Cash", "UPI", "Bank Transfer", "Cheque", "Card", "Other"].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">Remarks</label>
              <input value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Optional notes"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary text-sm" />
            </div>
            <Button type="submit" disabled={saving} className="w-full justify-center">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Recording..." : "Record Payment"}
            </Button>
          </form>
        </div>

        {/* Recent Payments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />Recent Payments
              </h3>
            </div>
            {recentPayments.length === 0 ? (
              <div className="p-10 text-center">
                <IndianRupee className="w-10 h-10 text-text-muted mx-auto mb-3" />
                <p className="text-sm text-text-violet-600">No payments recorded yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {["Student", "Fee", "Amount", "Method", "Receipt", "Status"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map(p => (
                      <tr key={p.id} className="border-b border-border/50 table-row-hover">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-text-primary">{p.student.firstName} {p.student.lastName}</p>
                          <p className="text-[11px] text-text-muted font-mono">{p.student.admissionNo}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-violet-600">{p.feeStructure.name}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-emerald-600">₹{p.amountPaid.toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3 text-sm text-text-violet-600">{p.paymentMethod || "—"}</td>
                        <td className="px-4 py-3 text-xs font-mono text-text-muted">{p.receiptNo}</td>
                        <td className="px-4 py-3">
                          <span className={cn("px-2.5 py-0.5 rounded-md text-xs font-medium", statusStyles[p.status])}>{p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
