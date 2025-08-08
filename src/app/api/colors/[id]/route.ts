import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const colorId = parseInt(id);

    if (isNaN(colorId)) {
      return NextResponse.json(
        { success: false, error: "Invalid color ID" },
        { status: 400 }
      );
    }

    const color = await prisma.color.findUnique({
      where: { id: colorId },
      include: {
        _count: {
          select: {
            productColors: true,
          },
        },
      },
    });

    if (!color) {
      return NextResponse.json(
        { success: false, error: "Color not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: color.id,
        code: color.code,
        colorName: color.name,
        hexCode: color.hexCode || "#000000",
        productCount: color._count.productColors,
      },
    });
  } catch (error) {
    console.error("Error fetching color:", error);
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
  const { id } = await params;
  try {
    const colorId = parseInt(id);
    const body = await request.json();
    const { colorName, hexCode, code } = body;

    if (isNaN(colorId)) {
      return NextResponse.json(
        { success: false, error: "Invalid color ID" },
        { status: 400 }
      );
    }

    if (!colorName || !hexCode) {
      return NextResponse.json(
        { success: false, error: "Color name and hex code are required" },
        { status: 400 }
      );
    }

    // Validate hex color format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(hexCode)) {
      return NextResponse.json(
        { success: false, error: "Invalid hex color format" },
        { status: 400 }
      );
    }

    // Check if color exists
    const existingColor = await prisma.color.findUnique({
      where: { id: colorId },
    });

    if (!existingColor) {
      return NextResponse.json(
        { success: false, error: "Color not found" },
        { status: 404 }
      );
    }

    // Check if name already exists (excluding current color)
    const nameExists = await prisma.color.findFirst({
      where: {
        name: colorName,
        id: { not: colorId },
      },
    });

    if (nameExists) {
      return NextResponse.json(
        { success: false, error: "Color name already exists" },
        { status: 400 }
      );
    }

    const updatedColor = await prisma.color.update({
      where: { id: colorId },
      data: {
        name: colorName,
        hexCode: hexCode,
        code: code || existingColor.code,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedColor,
    });
  } catch (error) {
    console.error("Error updating color:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const colorId = parseInt(id);

    if (isNaN(colorId)) {
      return NextResponse.json(
        { success: false, error: "Invalid color ID" },
        { status: 400 }
      );
    }

    // Check if color exists
    const existingColor = await prisma.color.findUnique({
      where: { id: colorId },
      include: {
        _count: {
          select: {
            productColors: true,
          },
        },
      },
    });

    if (!existingColor) {
      return NextResponse.json(
        { success: false, error: "Color not found" },
        { status: 404 }
      );
    }

    // Check if color has product associations
    if (existingColor._count.productColors > 0) {
      return NextResponse.json(
        { success: false, error: "Cannot delete color with existing product associations" },
        { status: 400 }
      );
    }

    await prisma.color.delete({
      where: { id: colorId },
    });

    return NextResponse.json({
      success: true,
      message: "Color deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting color:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
