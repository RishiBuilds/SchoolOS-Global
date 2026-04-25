"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] px-6">
      {/* Logo block */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight">
            SchoolOS<span className="text-primary"> Global</span>
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">Welcome back</h1>
        <p className="text-sm text-text-violet-600 mt-1">
          Sign in to continue to your dashboard
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-danger-light border border-danger/20 text-danger text-sm animate-scaleIn">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@schoolos.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-border text-text-primary placeholder:text-text-muted text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-11 py-2.5 rounded-lg bg-white border border-border text-text-primary placeholder:text-text-muted text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-violet-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>Sign in <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      {/* Demo hint */}
      <div className="mt-6 px-4 py-3 rounded-lg bg-primary-50 border border-primary/10">
        <p className="text-xs text-text-violet-600">
          <span className="font-medium text-text-primary">Demo account:</span>{" "}
          <code className="text-primary">admin@schoolos.com</code> / <code className="text-primary">admin123</code>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary relative items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-md px-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SchoolOS</span>
          </div>
          <h2 className="text-3xl font-bold leading-tight mb-4">
            Manage your school,<br />all in one place.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Track students, staff, classes, fees, attendance, and examinations from a single, unified dashboard. Built for modern schools that want to go paperless.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
            {[
              { label: "Students", value: "Enrollment & profiles" },
              { label: "Attendance", value: "Daily tracking" },
              { label: "Fees", value: "Invoicing & payments" },
              { label: "Exams", value: "Grades & reports" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-lg p-3">
                <p className="font-semibold text-white">{item.label}</p>
                <p className="text-white/60 text-xs mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-white/5" />
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <Suspense fallback={<div className="text-text-muted text-sm">Loading…</div>}>
          <LoginForm />
        </Suspense>
        <p className="absolute bottom-6 right-6 text-xs text-text-muted">
          © {new Date().getFullYear()} SchoolOS Global
        </p>
      </div>
    </div>
  );
}
