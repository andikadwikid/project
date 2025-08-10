import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Activate product by setting isActive to true
    await prisma.product.update({
      where: { id: productId },
      data: { isActive: true },
    });

    return NextResponse.json({
      success: true,
      message: "Product activated successfully",
    });
  } catch (error) {
    console.error("Error activating product:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}