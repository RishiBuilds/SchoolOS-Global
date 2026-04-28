import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/fees/structures
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;

    const structures = await prisma.feeStructure.findMany({
      where: { schoolId },
      include: {
        class: { select: { name: true, section: true } },
        _count: { select: { payments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(structures);
  } catch (error) {
    console.error("Error fetching fee structures:", error);
    return NextResponse.json({ error: "Failed to fetch fee structures" }, { status: 500 });
  }
}

// POST /api/fees/structures
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;
    const body = await req.json();

    const structure = await prisma.feeStructure.create({
      data: {
        name: body.name,
        amount: parseFloat(body.amount),
        classId: body.classId,
        schoolId,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        description: body.description || null,
      },
      include: {
        class: { select: { name: true, section: true } },
      },
    });

    return NextResponse.json(structure, { status: 201 });
  } catch (error) {
    console.error("Error creating fee structure:", error);
    return NextResponse.json({ error: "Failed to create fee structure" }, { status: 500 });
  }
}
