"use client";

import {
  Users, UserCheck, School, BookOpen, Plus,
  TrendingUp, Calendar, ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { StatCard, Button } from "@/components/ui/shared";

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-slideUp">
      {/* Welcome */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h1 className="text-xl font-semibold text-text-primary">
          Welcome to SchoolOS Global
        </h1>
        <p className="text-sm text-text-violet-600 mt-1">
          Manage your school operations from one place. Track students, staff, classes, and everything in between.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link href="/data-entry/students/new">
            <Button><Plus className="w-4 h-4" />Add Student</Button>
          </Link>
          <Link href="/data-entry/classes">
            <Button variant="secondary"><School className="w-4 h-4" />Manage Classes</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value="0" icon={Users} color="blue" trend={{ value: 0, positive: true }} />
        <StatCard label="Total Teachers" value="0" icon={UserCheck} color="green" trend={{ value: 0, positive: true }} />
        <StatCard label="Active Classes" value="0" icon={School} color="purple" />
        <StatCard label="Subjects" value="0" icon={BookOpen} color="amber" />
      </div>

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
              { label: "Add New Teacher", href: "/data-entry/teachers/new", icon: UserCheck, color: "text-emerald-600" },
              { label: "Create Class", href: "/data-entry/classes/new", icon: School, color: "text-violet-600" },
              { label: "Add Subject", href: "/data-entry/subjects/new", icon: BookOpen, color: "text-amber-600" },
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
            <Calendar className="w-4 h-4 text-primary" />Recent Activity
          </h3>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-11 h-11 rounded-xl bg-bg-muted flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-text-muted" />
            </div>
            <p className="text-sm text-text-violet-600">No recent activity</p>
            <p className="text-xs text-text-muted mt-1">Start by adding classes, students, and teachers</p>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Getting Started</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { step: "1", title: "Set Up Classes", desc: "Create classes and sections", href: "/data-entry/classes" },
            { step: "2", title: "Add Students", desc: "Register students to classes", href: "/data-entry/students" },
            { step: "3", title: "Add Teachers", desc: "Register teaching staff", href: "/data-entry/teachers" },
            { step: "4", title: "Create Subjects", desc: "Define and assign subjects", href: "/data-entry/subjects" },
          ].map((item) => (
            <Link key={item.step} href={item.href}
              className="group p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
              <div className="w-7 h-7 rounded-md bg-primary-50 text-primary text-xs font-bold flex items-center justify-center mb-2">
                {item.step}
              </div>
              <h4 className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{item.title}</h4>
              <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
