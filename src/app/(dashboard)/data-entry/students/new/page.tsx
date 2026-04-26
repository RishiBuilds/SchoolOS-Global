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
  IdCard,
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

  const getInitials = () => {
    const f = firstName?.[0] || "";
    const l = lastName?.[0] || "";
    return (f + l).toUpperCase() || "?";
  };

  const getInpClass = (hasIcon: boolean) =>
    `w-full ${
      hasIcon ? "pl-10" : "px-4"
    } pr-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted text-sm transition-all duration-200 hover:border-text-muted focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm outline-none`;

  const InputGroup = ({ icon: Icon, label, error, required, children }: any) => (
    <div>
      <label className="text-sm font-medium text-text-secondary mb-1.5 block">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="w-4.5 h-4.5 text-text-muted group-focus-within:text-primary transition-colors duration-200" />
          </div>
        )}
        {children}
      </div>
      {error && (
        <p className="text-danger text-[11px] mt-1.5 flex items-center gap-1.5 animate-fadeIn font-medium">
          <span className="inline-block w-1 h-1 rounded-full bg-danger" />
          {error.message}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-slideDown">
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
        <div className="hidden sm:flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3 shadow-sm">
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Section 1: Personal Info ── */}
        <div
          className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden animate-slideUp"
          style={{ animationDelay: "50ms", animationFillMode: "both" }}
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-gradient-to-r from-blue-50/80 to-transparent">
            <div className="w-8 h-8 rounded-xl bg-white shadow-sm border border-blue-100 flex items-center justify-center">
              <UserCircle className="w-4.5 h-4.5 text-blue-600" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              <InputGroup
                icon={Hash}
                label="Admission No"
                error={errors.admissionNo}
                required
              >
                <input
                  {...register("admissionNo")}
                  placeholder="e.g. ADM2025001"
                  className={getInpClass(true)}
                />
              </InputGroup>

              <InputGroup
                icon={IdCard}
                label="First Name"
                error={errors.firstName}
                required
              >
                <input
                  {...register("firstName")}
                  placeholder="First name"
                  className={getInpClass(true)}
                />
              </InputGroup>

              <InputGroup
                icon={IdCard}
                label="Last Name"
                error={errors.lastName}
                required
              >
                <input
                  {...register("lastName")}
                  placeholder="Last name"
                  className={getInpClass(true)}
                />
              </InputGroup>

              <InputGroup
                icon={Calendar}
                label="Date of Birth"
                error={errors.dateOfBirth}
                required
              >
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  className={getInpClass(true)}
                />
              </InputGroup>

              <InputGroup
                icon={Users}
                label="Gender"
                error={errors.gender}
                required
              >
                <select {...register("gender")} className={getInpClass(true)}>
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </InputGroup>

              <InputGroup icon={Heart} label="Blood Group">
                <select {...register("bloodGroup")} className={getInpClass(true)}>
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </InputGroup>

              <InputGroup icon={Phone} label="Phone">
                <input
                  {...register("phone")}
                  placeholder="+91 XXXXX XXXXX"
                  className={getInpClass(true)}
                />
              </InputGroup>

              <InputGroup icon={Mail} label="Email">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="student@email.com"
                  className={getInpClass(true)}
                />
              </InputGroup>
            </div>
          </div>
        </div>

        {/* ── Section 2: Academic Info ── */}
        <div
          className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden animate-slideUp"
          style={{ animationDelay: "100ms", animationFillMode: "both" }}
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-gradient-to-r from-violet-50/80 to-transparent">
            <div className="w-8 h-8 rounded-xl bg-white shadow-sm border border-violet-100 flex items-center justify-center">
              <GraduationCap className="w-4.5 h-4.5 text-violet-600" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <InputGroup
                icon={GraduationCap}
                label="Assign to Class"
                error={errors.classId}
                required
              >
                <select {...register("classId")} className={getInpClass(true)}>
                  <option value="">Select class</option>
                  {classes.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.section && ` — Sec ${c.section}`}
                    </option>
                  ))}
                </select>
              </InputGroup>
              <div className="flex items-end pb-1">
                <div className="bg-violet-50/50 rounded-xl px-4 py-3 border border-violet-100/50 flex items-start gap-2 w-full">
                  <Sparkles className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Students can be reassigned to a different class later from the
                    edit page without losing their historical records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 3: Address ── */}
        <div
          className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden animate-slideUp"
          style={{ animationDelay: "150ms", animationFillMode: "both" }}
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-gradient-to-r from-emerald-50/80 to-transparent">
            <div className="w-8 h-8 rounded-xl bg-white shadow-sm border border-emerald-100 flex items-center justify-center">
              <MapPin className="w-4.5 h-4.5 text-emerald-600" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              <div className="sm:col-span-2 lg:col-span-3">
                <InputGroup icon={MapPin} label="Street Address">
                  <input
                    {...register("address")}
                    placeholder="House/Flat no, Street, Locality"
                    className={getInpClass(true)}
                  />
                </InputGroup>
              </div>
              <InputGroup label="City">
                <input
                  {...register("city")}
                  placeholder="e.g. Bengaluru"
                  className={getInpClass(false)}
                />
              </InputGroup>
              <InputGroup label="State">
                <input
                  {...register("state")}
                  placeholder="e.g. Karnataka"
                  className={getInpClass(false)}
                />
              </InputGroup>
            </div>
          </div>
        </div>

        {/* ── Section 4: Parent / Guardian ── */}
        <div
          className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden animate-slideUp"
          style={{ animationDelay: "200ms", animationFillMode: "both" }}
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-gradient-to-r from-amber-50/80 to-transparent">
            <div className="w-8 h-8 rounded-xl bg-white shadow-sm border border-amber-100 flex items-center justify-center">
              <ShieldCheck className="w-4.5 h-4.5 text-amber-600" />
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
              <InputGroup
                icon={UserCircle}
                label="Full Name"
                error={errors.parentName}
                required
              >
                <input
                  {...register("parentName")}
                  placeholder="Parent / Guardian name"
                  className={getInpClass(true)}
                />
              </InputGroup>

              <InputGroup
                icon={Phone}
                label="Phone"
                error={errors.parentPhone}
                required
              >
                <input
                  {...register("parentPhone")}
                  placeholder="+91 XXXXX XXXXX"
                  className={getInpClass(true)}
                />
              </InputGroup>

              <InputGroup icon={Mail} label="Email">
                <input
                  type="email"
                  {...register("parentEmail")}
                  placeholder="parent@email.com"
                  className={getInpClass(true)}
                />
              </InputGroup>
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div
          className="flex items-center justify-between bg-white rounded-2xl border border-border shadow-sm px-6 py-5 animate-slideUp"
          style={{ animationDelay: "250ms", animationFillMode: "both" }}
        >
          <p className="text-xs text-text-muted hidden sm:block">
            Fields marked with <span className="text-danger font-medium">*</span>{" "}
            are required
          </p>
          <div className="flex gap-3 ml-auto">
            <Link href="/data-entry/students">
              <Button type="button" variant="secondary" size="lg">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={submitting} size="lg">
              {submitting ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <Save className="w-4.5 h-4.5" />
              )}
              {submitting ? "Saving..." : "Save Student"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

