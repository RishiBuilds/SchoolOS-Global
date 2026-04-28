"use client";

import { useState, useEffect } from "react";
import {
  Users, UserCheck, School, BookOpen, Plus,
  TrendingUp, Calendar, ArrowUpRight, CalendarCheck,
  IndianRupee, Wallet, BarChart3, Activity,
} from "lucide-react";
import Link from "next/link";
import { StatCard, Button } from "@/components/ui/shared";
import { cn, formatDate } from "@/lib/utils";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
  studentTrend: number;
  attendance: {
    present: number;
    absent: number;
    total: number;
    marked: number;
    breakdown: Record<string, number>;
  };
  finance: {
    feeCollected: number;
    expenses: number;
  };
  recentActivity: { type: string; text: string; time: string }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const s = stats;

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Welcome */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h1 className="text-xl font-semibold text-text-primary">
          Welcome to SchoolOS Global
        </h1>
        <p className="text-sm text-text-violet-600 mt-1">
          Manage your school operations from one place. Track students, staff, attendance, fees, and everything in between.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link href="/data-entry/students/new">
            <Button><Plus className="w-4 h-4" />Add Student</Button>
          </Link>
          <Link href="/attendance/mark">
            <Button variant="secondary"><CalendarCheck className="w-4 h-4" />Mark Attendance</Button>
          </Link>
          <Link href="/fees/collect">
            <Button variant="secondary"><IndianRupee className="w-4 h-4" />Collect Fee</Button>
          </Link>
        </div>
      </div>

      {/* Main Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Students" value={s?.totalStudents || 0} icon={Users} color="blue"
            trend={s?.studentTrend ? { value: Math.abs(s.studentTrend), positive: s.studentTrend >= 0 } : undefined} />
          <StatCard label="Total Teachers" value={s?.totalTeachers || 0} icon={UserCheck} color="green" />
          <StatCard label="Active Classes" value={s?.totalClasses || 0} icon={School} color="purple" />
          <StatCard label="Subjects" value={s?.totalSubjects || 0} icon={BookOpen} color="amber" />
        </div>
      )}

      {/* Attendance + Finance Row */}
      {!loading && s && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today's Attendance */}
          <div className="bg-white rounded-xl border border-border p-5 border-l-[3px] border-l-emerald-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-violet-600">Today&apos;s Attendance</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {s.attendance.marked > 0
                    ? `${Math.round((s.attendance.present / s.attendance.marked) * 100)}%`
                    : "—"}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {s.attendance.present} present / {s.attendance.marked} marked
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CalendarCheck className="w-[18px] h-[18px] text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Absent today */}
          <div className="bg-white rounded-xl border border-border p-5 border-l-[3px] border-l-red-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-violet-600">Absent Today</p>
                <p className="text-2xl font-bold text-red-500 mt-1">{s.attendance.absent}</p>
                <p className="text-xs text-text-muted mt-1">out of {s.attendance.total} students</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                <Users className="w-[18px] h-[18px] text-red-500" />
              </div>
            </div>
          </div>

          {/* Fee Collected */}
          <div className="bg-white rounded-xl border border-border p-5 border-l-[3px] border-l-blue-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-violet-600">Fee Collected (Month)</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  ₹{(s.finance.feeCollected || 0).toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-text-muted mt-1">this month</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <IndianRupee className="w-[18px] h-[18px] text-blue-600" />
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white rounded-xl border border-border p-5 border-l-[3px] border-l-amber-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-violet-600">Expenses (Month)</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  ₹{(s.finance.expenses || 0).toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-text-muted mt-1">this month</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <Wallet className="w-[18px] h-[18px] text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />Quick Actions
          </h3>
          <div className="space-y-1">
            {[
              { label: "Add New Student", href: "/data-entry/students/new", icon: Users, color: "text-blue-600" },
              { label: "Mark Attendance", href: "/attendance/mark", icon: CalendarCheck, color: "text-emerald-600" },
              { label: "Collect Fee", href: "/fees/collect", icon: IndianRupee, color: "text-violet-600" },
              { label: "Add Expense", href: "/expenses", icon: Wallet, color: "text-amber-600" },
              { label: "Create Exam", href: "/examinations", icon: BarChart3, color: "text-pink-600" },
              { label: "Create Class", href: "/data-entry/classes/new", icon: School, color: "text-indigo-600" },
            ].map((a) => (
              <Link key={a.href} href={a.href}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-bg-muted transition-colors group">
                <div className="flex items-center gap-2.5">
                  <a.icon className={`w-4 h-4 ${a.color}`} />
                  <span className="text-sm text-text-violet-600 group-hover:text-text-primary transition-colors">{a.label}</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" />Recent Activity
          </h3>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}</div>
          ) : s?.recentActivity && s.recentActivity.length > 0 ? (
            <div className="space-y-1">
              {s.recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-bg-muted transition-colors">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    a.type === "student" ? "bg-blue-50" : "bg-emerald-50"
                  )}>
                    {a.type === "student" ? (
                      <Users className="w-4 h-4 text-blue-600" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">{a.text}</p>
                    <p className="text-[11px] text-text-muted">{formatDate(a.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-11 h-11 rounded-xl bg-bg-muted flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 text-text-muted" />
              </div>
              <p className="text-sm text-text-violet-600">No recent activity</p>
              <p className="text-xs text-text-muted mt-1">Start by adding classes, students, and teachers</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
