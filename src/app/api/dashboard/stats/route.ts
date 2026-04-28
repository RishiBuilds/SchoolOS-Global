import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/dashboard/stats
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;

    // Today range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // This month range
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    // Last month range (for trends)
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      totalSubjects,
      todayAttendance,
      totalStudentsForAttendance,
      monthFeePayments,
      monthExpenses,
      lastMonthStudents,
      recentStudents,
      recentTeachers,
    ] = await Promise.all([
      prisma.student.count({ where: { schoolId, isActive: true } }),
      prisma.teacher.count({ where: { schoolId, isActive: true } }),
      prisma.class.count({ where: { schoolId } }),
      prisma.subject.count({ where: { schoolId } }),
      // Today's attendance
      prisma.studentAttendance.groupBy({
        by: ["status"],
        where: {
          class: { schoolId },
          date: { gte: today, lt: tomorrow },
        },
        _count: { status: true },
      }),
      prisma.student.count({ where: { schoolId, isActive: true } }),
      // This month fee collection
      prisma.feePayment.aggregate({
        where: {
          feeStructure: { schoolId },
          paymentDate: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amountPaid: true },
      }),
      // This month expenses
      prisma.expense.aggregate({
        where: {
          schoolId,
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      }),
      // Last month student count for trend
      prisma.student.count({
        where: {
          schoolId,
          isActive: true,
          createdAt: { lte: lastMonthEnd },
        },
      }),
      // Recent students
      prisma.student.findMany({
        where: { schoolId },
        select: { firstName: true, lastName: true, createdAt: true, class: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      // Recent teachers
      prisma.teacher.findMany({
        where: { schoolId },
        select: { firstName: true, lastName: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    // Calculate attendance summary
    const attendanceMap: Record<string, number> = {};
    todayAttendance.forEach((a) => {
      attendanceMap[a.status] = a._count.status;
    });

    const presentToday = (attendanceMap["PRESENT"] || 0) + (attendanceMap["LATE"] || 0);
    const absentToday = attendanceMap["ABSENT"] || 0;
    const totalMarked = Object.values(attendanceMap).reduce((s, v) => s + v, 0);

    // Student trend
    const studentTrend = lastMonthStudents > 0
      ? Math.round(((totalStudents - lastMonthStudents) / lastMonthStudents) * 100)
      : 0;

    // Build recent activity
    const activity = [
      ...recentStudents.map((s) => ({
        type: "student" as const,
        text: `${s.firstName} ${s.lastName} added to ${s.class.name}`,
        time: s.createdAt,
      })),
      ...recentTeachers.map((t) => ({
        type: "teacher" as const,
        text: `${t.firstName} ${t.lastName} joined as teacher`,
        time: t.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 6);

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      totalSubjects,
      studentTrend,
      attendance: {
        present: presentToday,
        absent: absentToday,
        total: totalStudentsForAttendance,
        marked: totalMarked,
        breakdown: attendanceMap,
      },
      finance: {
        feeCollected: monthFeePayments._sum.amountPaid || 0,
        expenses: monthExpenses._sum.amount || 0,
      },
      recentActivity: activity,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
