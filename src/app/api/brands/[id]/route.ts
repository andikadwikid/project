import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const brandId = parseInt(id)

    if (isNaN(brandId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid brand ID' },
        { status: 400 }
      )
    }

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      include: {
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
    })

    if (!brand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: brand.id,
        code: brand.code,
        name: brand.name,
        productCount: brand._count.products,
      },
    })
  } catch (error) {
    console.error('Error fetching brand:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const brandId = parseInt(id)
    const body = await request.json()
    const { name, code } = body

    if (isNaN(brandId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid brand ID' },
        { status: 400 }
      )
    }

    if (!name || !code) {
      return NextResponse.json(
        { success: false, error: 'Name and code are required' },
        { status: 400 }
      )
    }

    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id: brandId },
    })

    if (!existingBrand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      )
    }

    // Check if name already exists (excluding current brand)
    const nameExists = await prisma.brand.findFirst({
      where: {
        name,
        id: { not: brandId },
      },
    })

    if (nameExists) {
      return NextResponse.json(
        { success: false, error: 'Brand name already exists' },
        { status: 400 }
      )
    }

    // Check if code already exists (excluding current brand)
    const codeExists = await prisma.brand.findFirst({
      where: {
        code,
        id: { not: brandId },
      },
    })

    if (codeExists) {
      return NextResponse.json(
        { success: false, error: 'Brand code already exists' },
        { status: 400 }
      )
    }

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        name,
        code,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedBrand,
    })
  } catch (error) {
    console.error('Error updating brand:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const brandId = parseInt(id)

    if (isNaN(brandId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid brand ID' },
        { status: 400 }
      )
    }

    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id: brandId },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    if (!existingBrand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      )
    }

    // Check if brand has products
    if (existingBrand._count.products > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete brand with existing products' },
        { status: 400 }
      )
    }

    await prisma.brand.delete({
      where: { id: brandId },
    })

    return NextResponse.json({
      success: true,
      message: 'Brand deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting brand:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}