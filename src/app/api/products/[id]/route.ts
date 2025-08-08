import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
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

    // Get product with all relations
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        isActive: true,
      },
      include: {
        category: true,
        brand: true,
        colors: {
          include: {
            color: true,
          },
          orderBy: {
            id: "asc",
          },
        },
        sizes: {
          include: {
            size: true,
          },
          orderBy: {
            size: {
              sizeLabel: "asc",
            },
          },
        },
        images: {
          include: {
            productColor: {
              include: {
                color: true,
              },
            },
          },
          orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Transform data to match frontend interface
    const transformedProduct = {
      id: product.id,
      code: product.code,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      categoryId: product.categoryId,
      brandId: product.brandId,
      isActive: product.isActive,
      category: {
        id: product.category.id,
        name: product.category.name,
        code: product.category.code,
      },
      brand: {
        id: product.brand.id,
        name: product.brand.name,
        code: product.brand.code,
      },
      colors: product.colors.map((productColor) => ({
        id: productColor.color.id,
        code: productColor.color.code,
        colorName: productColor.color.name,
        hexCode: productColor.color.hexCode,
      })),
      sizes: product.sizes.map((sizePivot) => ({
        id: sizePivot.size.id,
        code: sizePivot.size.code,
        sizeLabel: sizePivot.size.sizeLabel,
        cmValue: sizePivot.size.cmValue,
      })),
      images: product.images.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
        isPrimary: image.isPrimary,
        sortOrder: image.sortOrder,
      })),
    };

    return NextResponse.json({
      success: true,
      data: transformedProduct,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
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
    const productId = parseInt(id);
    const body = await request.json();
    const {
      name,
      description,
      categoryId,
      brandId,
      price,
      colorIds = [],
      sizeIds = [],
      images = [],
      isActive = true,
    } = body;

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !categoryId || !brandId || !price) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: name, categoryId, brandId, price",
        },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        colors: true,
        sizes: true,
        images: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update basic product info
      await tx.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          categoryId: parseInt(categoryId),
          brandId: parseInt(brandId),
          price: parseFloat(price),
          isActive,
        },
      });

      // Update colors - remove existing associations and create new ones
      await tx.productColor.deleteMany({
        where: { productId },
      });

      if (colorIds.length > 0) {
        // Create new ProductColor entries for this product
        const colorData = colorIds.map((colorId: number) => ({
          productId,
          colorId,
        }));

        await tx.productColor.createMany({
          data: colorData,
        });
      }

      // Update sizes - remove existing associations and create new ones
      await tx.productSizePivot.deleteMany({
        where: { productId },
      });

      if (sizeIds.length > 0) {
        // Create new pivot entries for this product
        const sizeData = sizeIds.map((sizeId: number) => ({
          productId,
          sizeId,
        }));

        await tx.productSizePivot.createMany({
          data: sizeData,
        });
      }

      // Update images - remove existing and create new ones
      await tx.productImage.deleteMany({
        where: { productId },
      });

      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((imageUrl: string, index: number) => ({
            productId,
            imageUrl,
            isPrimary: index === 0,
            sortOrder: index + 1,
          })),
        });
      }

      // Return updated product with all relations
      return await tx.product.findUnique({
        where: { id: productId },
        include: {
          category: true,
          brand: true,
          colors: true,
          sizes: true,
          images: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error updating product:", error);
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

    // Soft delete by setting isActive to false
    await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
