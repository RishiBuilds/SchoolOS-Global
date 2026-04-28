import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/fees/payments
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const status = searchParams.get("status");

    const where: any = {
      feeStructure: { schoolId },
    };

    if (studentId) where.studentId = studentId;
    if (status) where.status = status;

    const payments = await prisma.feePayment.findMany({
      where,
      include: {
        student: { select: { firstName: true, lastName: true, admissionNo: true, class: { select: { name: true, section: true } } } },
        feeStructure: { select: { name: true, amount: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

// POST /api/fees/payments
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Auto-generate receipt number
    const receiptNo = `RCP-${Date.now()}`;

    // Determine payment status
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: body.feeStructureId },
    });

    if (!feeStructure) {
      return NextResponse.json({ error: "Fee structure not found" }, { status: 404 });
    }

    // Check existing payments for this student + fee
    const existingPayments = await prisma.feePayment.findMany({
      where: {
        studentId: body.studentId,
        feeStructureId: body.feeStructureId,
      },
    });

    const totalPaidSoFar = existingPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    const newTotal = totalPaidSoFar + parseFloat(body.amountPaid);
    const status = newTotal >= feeStructure.amount ? "PAID" : "PARTIAL";

    const payment = await prisma.feePayment.create({
      data: {
        studentId: body.studentId,
        feeStructureId: body.feeStructureId,
        amountPaid: parseFloat(body.amountPaid),
        paymentMethod: body.paymentMethod || null,
        receiptNo,
        status,
        remarks: body.remarks || null,
      },
      include: {
        student: { select: { firstName: true, lastName: true } },
        feeStructure: { select: { name: true, amount: true } },
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
