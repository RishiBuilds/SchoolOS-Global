"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, ArrowLeft, Loader2, Save } from "lucide-react";
import { PageHeader, Button } from "@/components/ui/shared";
import { subjectSchema, type SubjectFormData } from "@/lib/validations/subject";
import { toast } from "sonner";
import Link from "next/link";

export default function NewSubjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SubjectFormData>({ resolver: zodResolver(subjectSchema) });

  const onSubmit = async (data: SubjectFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/subjects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { toast.success("Subject created!"); router.push("/data-entry/subjects"); }
      else { const err = await res.json(); toast.error(err.error || "Failed"); }
    } catch { toast.error("Error"); } finally { setSubmitting(false); }
  };

  const inp = "w-full px-4 py-2.5 rounded-lg bg-bg-input border border-border text-text-primary placeholder:text-text-muted text-sm";

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slideUp">
      <div className="flex items-center gap-3">
        <Link href="/data-entry/subjects"><button className="p-2 rounded-lg hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors"><ArrowLeft className="w-5 h-5" /></button></Link>
        <PageHeader title="Add New Subject" description="Create a new subject" icon={BookOpen} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-border p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div><label className="block text-sm font-medium text-text-violet-600 mb-1.5">Subject Name *</label><input {...register("name")} placeholder="e.g. Mathematics" className={inp} />{errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}</div>
          <div><label className="block text-sm font-medium text-text-violet-600 mb-1.5">Subject Code *</label><input {...register("code")} placeholder="e.g. MATH" className={inp} />{errors.code && <p className="text-danger text-xs mt-1">{errors.code.message}</p>}</div>
          <div className="sm:col-span-2"><label className="block text-sm font-medium text-text-violet-600 mb-1.5">Description</label><textarea {...register("description")} rows={3} placeholder="Optional description" className={inp + " resize-none"} /></div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Link href="/data-entry/subjects"><Button type="button" variant="secondary">Cancel</Button></Link>
          <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{submitting ? "Saving..." : "Save Subject"}</Button>
        </div>
      </form>
    </div>
  );
}
