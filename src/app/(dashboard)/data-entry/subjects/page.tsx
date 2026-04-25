"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Plus, Search, Pencil, Trash2, Loader2, Hash } from "lucide-react";
import { PageHeader, Button, EmptyState } from "@/components/ui/shared";
import { toast } from "sonner";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/subjects").then(r => r.json()).then(setSubjects).catch(() => toast.error("Failed")).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this subject?")) return;
    setDeleteId(id);
    try {
      const res = await fetch(`/api/subjects/${id}`, { method: "DELETE" });
      if (res.ok) { setSubjects(p => p.filter(s => s.id !== id)); toast.success("Deleted"); }
      else toast.error("Failed");
    } catch { toast.error("Failed"); } finally { setDeleteId(null); }
  };

  const filtered = subjects.filter(s => !search || `${s.name} ${s.code}`.toLowerCase().includes(search.toLowerCase()));

  const colors = ["bg-primary/10 text-primary", "bg-emerald-50 text-emerald-600", "bg-violet-50 text-violet-600", "bg-warning/10 text-warning", "bg-danger/10 text-danger"];

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader title="Subject Setup" description="Create and manage subjects" icon={BookOpen}
        action={<Link href="/data-entry/subjects/new"><Button><Plus className="w-4 h-4" />Add Subject</Button></Link>} />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input type="text" placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-border text-text-primary placeholder:text-text-muted text-sm" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No subjects found" description="Create your first subject"
          action={<Link href="/data-entry/subjects/new"><Button><Plus className="w-4 h-4" />Add Subject</Button></Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((sub, i) => (
            <div key={sub.id} className="card-hover bg-white rounded-xl border border-border p-5 group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[i % colors.length]}`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{sub.name}</h3>
                    <p className="text-xs text-text-muted font-mono flex items-center gap-1"><Hash className="w-3 h-3" />{sub.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/data-entry/subjects/${sub.id}/edit`}><button className="p-1.5 rounded-lg hover:bg-bg-muted text-text-muted hover:text-primary transition-colors"><Pencil className="w-3.5 h-3.5" /></button></Link>
                  <button onClick={() => handleDelete(sub.id)} disabled={deleteId === sub.id} className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-colors disabled:opacity-50">
                    {deleteId === sub.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              {sub.description && <p className="text-xs text-text-muted mt-3 line-clamp-2">{sub.description}</p>}
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-xs text-text-muted">{sub._count?.assignments || 0} class assignments</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
