import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/students
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const search = searchParams.get("search");

    const where: any = { schoolId };

    if (classId) where.classId = classId;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { admissionNo: { contains: search, mode: "insensitive" } },
      ];
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        class: { select: { name: true, section: true } },
      },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

// POST /api/students
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;
    const body = await req.json();

    const student = await prisma.student.create({
      data: {
        admissionNo: body.admissionNo,
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: new Date(body.dateOfBirth),
        gender: body.gender,
        bloodGroup: body.bloodGroup || null,
        address: body.address || null,
        city: body.city || null,
        state: body.state || null,
        phone: body.phone || null,
        email: body.email || null,
        parentName: body.parentName,
        parentPhone: body.parentPhone,
        parentEmail: body.parentEmail || null,
        classId: body.classId,
        schoolId,
      },
      include: {
        class: { select: { name: true, section: true } },
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A student with this admission number already exists" },
        { status: 409 }
      );
    }
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}
