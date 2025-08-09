import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const colors = await prisma.color.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            productColors: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: colors.map((color) => ({
        id: color.id,
        code: color.code,
        name: color.name,
        hexCode: color.hexCode || "#000000",
        productCount: color._count.productColors,
      })),
    });
  } catch (error) {
    console.error("Error fetching colors:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch colors",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { colorName, hexCode, code } = body;

    if (!colorName || !hexCode || !code) {
      return NextResponse.json(
        {
          success: false,
          error: "Color name, hex code, and code are required",
        },
        { status: 400 }
      );
    }

    // Validate hex color format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(hexCode)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid hex color format",
        },
        { status: 400 }
      );
    }

    // Check if color name already exists
    const existingColorName = await prisma.color.findFirst({
      where: { name: colorName },
    });

    if (existingColorName) {
      return NextResponse.json(
        {
          success: false,
          error: "Color name already exists",
        },
        { status: 400 }
      );
    }

    // Check if color code already exists
    const existingColorCode = await prisma.color.findFirst({
      where: { code },
    });

    if (existingColorCode) {
      return NextResponse.json(
        {
          success: false,
          error: "Color code already exists",
        },
        { status: 400 }
      );
    }

    // Create new color in master table
    const color = await prisma.color.create({
      data: {
        code,
        name: colorName,
        hexCode: hexCode,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: color.id,
        code: color.code,
        colorName: color.name,
        hexCode: color.hexCode,
      },
    });
  } catch (error) {
    console.error("Error creating color:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create color",
      },
      { status: 500 }
    );
  }
}
