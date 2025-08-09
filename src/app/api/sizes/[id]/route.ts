import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const sizeId = parseInt(id);

    if (isNaN(sizeId)) {
      return NextResponse.json(
        { success: false, error: "Invalid size ID" },
        { status: 400 }
      );
    }

    const size = await prisma.size.findUnique({
      where: { id: sizeId },
    });

    if (!size) {
      return NextResponse.json(
        { success: false, error: "Size not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: size.id,
        code: size.code,
        label: size.sizeLabel,
        cmValue: size.cmValue,
      },
    });
  } catch (error) {
    console.error("Error fetching size:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const sizeId = parseInt(id);
    const body = await request.json();
    const { sizeLabel, code } = body;

    if (isNaN(sizeId)) {
      return NextResponse.json(
        { success: false, error: "Invalid size ID" },
        { status: 400 }
      );
    }

    if (!sizeLabel || !code) {
      return NextResponse.json(
        { success: false, error: "Size label and code are required" },
        { status: 400 }
      );
    }

    // Check if size exists
    const existingSize = await prisma.size.findUnique({
      where: { id: sizeId },
    });

    if (!existingSize) {
      return NextResponse.json(
        { success: false, error: "Size not found" },
        { status: 404 }
      );
    }

    // Check if label already exists (excluding current size)
    const labelExists = await prisma.size.findFirst({
      where: {
        sizeLabel: sizeLabel,
        id: { not: sizeId },
      },
    });

    if (labelExists) {
      return NextResponse.json(
        { success: false, error: "Size label already exists" },
        { status: 400 }
      );
    }

    // Check if code already exists (excluding current size)
    const codeExists = await prisma.size.findFirst({
      where: {
        code: code,
        id: { not: sizeId },
      },
    });

    if (codeExists) {
      return NextResponse.json(
        { success: false, error: "Size code already exists" },
        { status: 400 }
      );
    }

    const updatedSize = await prisma.size.update({
      where: { id: sizeId },
      data: {
        sizeLabel: sizeLabel,
        code: code,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedSize,
    });
  } catch (error) {
    console.error("Error updating size:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update size" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const sizeId = parseInt(id);

    if (isNaN(sizeId)) {
      return NextResponse.json(
        { success: false, error: "Invalid size ID" },
        { status: 400 }
      );
    }

    // Check if size exists
    const existingSize = await prisma.size.findUnique({
      where: { id: sizeId },
    });

    if (!existingSize) {
      return NextResponse.json(
        { success: false, error: "Size not found" },
        { status: 404 }
      );
    }

    // Size can be deleted directly as it doesn't have direct image relations

    await prisma.size.delete({
      where: { id: sizeId },
    });

    return NextResponse.json({
      success: true,
      message: "Size deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting size:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
