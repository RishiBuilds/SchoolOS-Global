"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, ArrowLeft, Loader2, Save } from "lucide-react";
import { PageHeader, Button } from "@/components/ui/shared";
import { subjectSchema, type SubjectFormData } from "@/lib/validations/subject";
import { toast } from "sonner";
import Link from "next/link";

export default function EditSubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SubjectFormData>({ resolver: zodResolver(subjectSchema) });

  useEffect(() => {
    fetch(`/api/subjects/${id}`).then(r => r.json()).then(s => {
      reset({ name: s.name, code: s.code, description: s.description || "" });
    }).catch(() => toast.error("Failed")).finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (data: SubjectFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/subjects/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { toast.success("Updated!"); router.push("/data-entry/subjects"); }
      else { const err = await res.json(); toast.error(err.error || "Failed"); }
    } catch { toast.error("Error"); } finally { setSubmitting(false); }
  };

  if (loading) return <div className="max-w-2xl mx-auto"><div className="skeleton h-48 rounded-xl" /></div>;

  const inp = "w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted text-sm";

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slideUp">
      <div className="flex items-center gap-3">
        <Link href="/data-entry/subjects"><button className="p-2 rounded-lg hover:bg-bg-card text-text-muted hover:text-text-primary transition-colors"><ArrowLeft className="w-5 h-5" /></button></Link>
        <PageHeader title="Edit Subject" icon={BookOpen} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-card rounded-xl border border-border p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">Subject Name *</label><input {...register("name")} className={inp} />{errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}</div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1.5">Subject Code *</label><input {...register("code")} className={inp} />{errors.code && <p className="text-danger text-xs mt-1">{errors.code.message}</p>}</div>
          <div className="sm:col-span-2"><label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label><textarea {...register("description")} rows={3} className={inp + " resize-none"} /></div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Link href="/data-entry/subjects"><Button type="button" variant="secondary">Cancel</Button></Link>
          <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{submitting ? "Saving..." : "Update Subject"}</Button>
        </div>
      </form>
    </div>
  );
}
