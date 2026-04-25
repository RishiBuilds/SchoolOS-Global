"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users, ArrowLeft, Loader2, Save } from "lucide-react";
import { PageHeader, Button } from "@/components/ui/shared";
import { studentSchema, type StudentFormData } from "@/lib/validations/student";
import { toast } from "sonner";
import Link from "next/link";

export default function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<StudentFormData>({ resolver: zodResolver(studentSchema) });

  useEffect(() => {
    Promise.all([fetch(`/api/students/${id}`).then(r => r.json()), fetch("/api/classes").then(r => r.json())])
      .then(([student, cls]) => {
        setClasses(cls);
        reset({
          admissionNo: student.admissionNo, firstName: student.firstName, lastName: student.lastName,
          dateOfBirth: student.dateOfBirth?.split("T")[0] || "", gender: student.gender,
          bloodGroup: student.bloodGroup || "", address: student.address || "",
          city: student.city || "", state: student.state || "", phone: student.phone || "",
          email: student.email || "", parentName: student.parentName, parentPhone: student.parentPhone,
          parentEmail: student.parentEmail || "", classId: student.classId,
        });
      }).catch(() => toast.error("Failed to load")).finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (data: StudentFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/students/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { toast.success("Student updated!"); router.push("/data-entry/students"); }
      else { const err = await res.json(); toast.error(err.error || "Failed"); }
    } catch { toast.error("Error"); } finally { setSubmitting(false); }
  };

  if (loading) return <div className="max-w-4xl mx-auto"><div className="skeleton h-96 rounded-xl" /></div>;

  const inp = "w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted text-sm";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slideUp">
      <div className="flex items-center gap-3">
        <Link href="/data-entry/students"><button className="p-2 rounded-lg hover:bg-bg-card text-text-muted hover:text-text-primary transition-colors"><ArrowLeft className="w-5 h-5" /></button></Link>
        <PageHeader title="Edit Student" icon={Users} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-card rounded-xl border border-border p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">Admission No *</label><input {...register("admissionNo")} className={inp} />{errors.admissionNo && <p className="text-danger text-xs mt-1">{errors.admissionNo.message}</p>}</div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">First Name *</label><input {...register("firstName")} className={inp} />{errors.firstName && <p className="text-danger text-xs mt-1">{errors.firstName.message}</p>}</div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">Last Name *</label><input {...register("lastName")} className={inp} />{errors.lastName && <p className="text-danger text-xs mt-1">{errors.lastName.message}</p>}</div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">Date of Birth *</label><input type="date" {...register("dateOfBirth")} className={inp} /></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">Gender *</label><select {...register("gender")} className={inp}><option value="">Select</option><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option></select></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">Class *</label><select {...register("classId")} className={inp}><option value="">Select</option>{classes.map((c:any) => <option key={c.id} value={c.id}>{c.name}{c.section && ` — ${c.section}`}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">Phone</label><input {...register("phone")} className={inp} /></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label><input type="email" {...register("email")} className={inp} /></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">Blood Group</label><select {...register("bloodGroup")} className={inp}><option value="">Select</option>{["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b=><option key={b} value={b}>{b}</option>)}</select></div>
          <div className="sm:col-span-2 lg:col-span-3"><label className="block text-sm font-medium text-text-secondary mb-1.5">Address</label><input {...register("address")} className={inp} /></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">City</label><input {...register("city")} className={inp} /></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">State</label><input {...register("state")} className={inp} /></div>
        </div>
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-warning" />Parent / Guardian</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">Parent Name *</label><input {...register("parentName")} className={inp} />{errors.parentName && <p className="text-danger text-xs mt-1">{errors.parentName.message}</p>}</div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">Parent Phone *</label><input {...register("parentPhone")} className={inp} />{errors.parentPhone && <p className="text-danger text-xs mt-1">{errors.parentPhone.message}</p>}</div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">Parent Email</label><input type="email" {...register("parentEmail")} className={inp} /></div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Link href="/data-entry/students"><Button type="button" variant="secondary">Cancel</Button></Link>
          <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{submitting ? "Saving..." : "Update Student"}</Button>
        </div>
      </form>
    </div>
  );
}
