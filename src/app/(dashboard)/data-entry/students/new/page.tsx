"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Users,
  ArrowLeft,
  Loader2,
  Save,
  UserCircle,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Hash,
  Calendar,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/shared";
import { studentSchema, type StudentFormData } from "@/lib/validations/student";
import { toast } from "sonner";
import Link from "next/link";

export default function NewStudentPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const firstName = watch("firstName");
  const lastName = watch("lastName");

  useEffect(() => {
    fetch("/api/classes")
      .then((r) => r.json())
      .then(setClasses)
      .catch(() => toast.error("Failed to load classes"));
  }, []);

  const onSubmit = async (data: StudentFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Student added successfully!");
        router.push("/data-entry/students");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to add student");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const inp =
    "w-full px-4 py-2.5 rounded-lg bg-bg-input border border-border text-text-primary placeholder:text-text-muted text-sm transition-all duration-200 hover:border-text-muted";

  const getInitials = () => {
    const f = firstName?.[0] || "";
    const l = lastName?.[0] || "";
    return (f + l).toUpperCase() || "?";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/data-entry/students">
            <button className="p-2.5 rounded-xl bg-white border border-border hover:bg-bg-muted text-text-muted hover:text-text-primary transition-all duration-200 hover:shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-text-primary flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Users className="w-[18px] h-[18px] text-white" />
              </div>
              Add New Student
            </h1>
            <p className="text-sm text-text-muted mt-0.5 ml-11">
              Register a new student to your school
            </p>
          </div>
        </div>

        {/* Live avatar preview */}
        <div className="hidden sm:flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {getInitials()}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary leading-tight">
              {firstName || lastName
                ? `${firstName || ""} ${lastName || ""}`.trim()
                : "Student Name"}
            </p>
            <p className="text-[11px] text-text-muted">Live preview</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ── Section 1: Personal Info ── */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border bg-gradient-to-r from-blue-50/80 to-transparent">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Personal Information
              </h2>
              <p className="text-[11px] text-text-muted">
                Basic details about the student
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
              {/* Admission No */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-text-secondary mb-1.5">
                  <Hash className="w-3.5 h-3.5 text-text-muted" />
                  Admission No <span className="text-danger">*</span>
                </label>
                <input
                  {...register("admissionNo")}
                  placeholder="e.g. ADM2025001"
                  className={inp}
                />
                {errors.admissionNo && (
                  <p className="text-danger text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-danger" />
                    {errors.admissionNo.message}
                  </p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-text-secondary mb-1.5">
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  {...register("firstName")}
                  placeholder="First name"
                  className={inp}
                />
                {errors.firstName && (
                  <p className="text-danger text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-danger" />
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-text-secondary mb-1.5">
                  Last Name <span className="text-danger">*</span>
                </label>
                <input
                  {...register("lastName")}
                  placeholder="Last name"
                  className={inp}
                />
                {errors.lastName && (
                  <p className="text-danger text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-danger" />
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* DOB */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-text-secondary mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-text-muted" />
                  Date of Birth <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  className={inp}
                />
                {errors.dateOfBirth && (
                  <p className="text-danger text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-danger" />
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-text-secondary mb-1.5">
                  Gender <span className="text-danger">*</span>
                </label>
                <select {...register("gender")} className={inp}>
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-danger text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-danger" />
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-text-secondary mb-1.5">
                  <Heart className="w-3.5 h-3.5 text-text-muted" />
                  Blood Group
                </label>
                <select {...register("bloodGroup")} className={inp}>
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                    (b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-text-secondary mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-text-muted" />
                  Phone
                </label>
                <input
                  {...register("phone")}
                  placeholder="+91 XXXXX XXXXX"
                  className={inp}
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-text-secondary mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-text-muted" />
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="student@email.com"
                  className={inp}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2: Academic Info ── */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border bg-gradient-to-r from-violet-50/80 to-transparent">
            <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Academic Details
              </h2>
              <p className="text-[11px] text-text-muted">
                Class assignment for the current academic year
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-text-secondary mb-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-text-muted" />
                  Assign to Class <span className="text-danger">*</span>
                </label>
                <select {...register("classId")} className={inp}>
                  <option value="">Select class</option>
                  {classes.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.section && ` — Sec ${c.section}`}
                    </option>
                  ))}
                </select>
                {errors.classId && (
                  <p className="text-danger text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-danger" />
                    {errors.classId.message}
                  </p>
                )}
              </div>
              <div className="flex items-end pb-1">
                <p className="text-xs text-text-muted bg-violet-50 rounded-lg px-3 py-2 border border-violet-100">
                  <Sparkles className="w-3 h-3 inline mr-1 text-violet-500" />
                  Students can be reassigned to a different class later from the
                  edit page.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 3: Address ── */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border bg-gradient-to-r from-emerald-50/80 to-transparent">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Address
              </h2>
              <p className="text-[11px] text-text-muted">
                Residential address (optional)
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="flex items-center gap-1.5 text-sm font-medium text-text-secondary mb-1.5">
                  Street Address
                </label>
                <input
                  {...register("address")}
                  placeholder="House/Flat no, Street, Locality"
                  className={inp}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary mb-1.5 block">
                  City
                </label>
                <input
                  {...register("city")}
                  placeholder="e.g. Bengaluru"
                  className={inp}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary mb-1.5 block">
                  State
                </label>
                <input
                  {...register("state")}
                  placeholder="e.g. Karnataka"
                  className={inp}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 4: Parent / Guardian ── */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border bg-gradient-to-r from-amber-50/80 to-transparent">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Parent / Guardian
              </h2>
              <p className="text-[11px] text-text-muted">
                Primary contact information for the student&apos;s guardian
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-text-secondary mb-1.5">
                  <UserCircle className="w-3.5 h-3.5 text-text-muted" />
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  {...register("parentName")}
                  placeholder="Parent / Guardian name"
                  className={inp}
                />
                {errors.parentName && (
                  <p className="text-danger text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-danger" />
                    {errors.parentName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-text-secondary mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-text-muted" />
                  Phone <span className="text-danger">*</span>
                </label>
                <input
                  {...register("parentPhone")}
                  placeholder="+91 XXXXX XXXXX"
                  className={inp}
                />
                {errors.parentPhone && (
                  <p className="text-danger text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-danger" />
                    {errors.parentPhone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-text-secondary mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-text-muted" />
                  Email
                </label>
                <input
                  type="email"
                  {...register("parentEmail")}
                  placeholder="parent@email.com"
                  className={inp}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-border px-6 py-4">
          <p className="text-xs text-text-muted hidden sm:block">
            Fields marked with <span className="text-danger font-medium">*</span> are required
          </p>
          <div className="flex gap-3 ml-auto">
            <Link href="/data-entry/students">
              <Button type="button" variant="secondary" size="lg">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={submitting} size="lg">
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {submitting ? "Saving..." : "Save Student"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
