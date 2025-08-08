import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      )
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
          orderBy: {
            id: 'asc',
          },
        },
        sizes: {
          orderBy: {
            sizeLabel: 'asc',
          },
        },
        images: {
          include: {
            color: true,
          },
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Transform data to match frontend interface
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      brand: product.brand.name,
      category: product.category.name,
      price: Number(product.price),
      originalPrice: null, // You can add this field to schema if needed
      image: product.images.find(img => img.isPrimary && !img.colorId)?.imageUrl || 
             product.images.find(img => img.isPrimary)?.imageUrl || 
             `/images/products/product-${product.id}.jpg`, // Fallback image path
      rating: 4.5, // You can add rating system later
      isNew: false, // You can add this field to schema if needed
      colors: product.colors.map(color => ({
        id: color.id,
        code: color.code,
        colorName: color.colorName,
        hexCode: color.hexCode,
        imageUrl: color.imageUrl,
      })),
      sizes: product.sizes.map(size => ({
        id: size.id,
        code: size.code,
        sizeLabel: size.sizeLabel,
        cmValue: size.cmValue,
      })),
      images: product.images.map(image => ({
        id: image.id,
        imageUrl: image.imageUrl,
        isPrimary: image.isPrimary,
        colorId: image.colorId,
      })),
    }

    return NextResponse.json({
      success: true,
      data: transformedProduct,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)
    const body = await request.json()

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        isActive: body.isActive,
      },
      include: {
        category: true,
        brand: true,
        colors: true,
        sizes: true,
        images: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Soft delete by setting isActive to false
    await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}