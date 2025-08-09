import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
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

    return NextResponse.json({
      success: true,
      data: categories.map((category) => ({
        id: category.id,
        code: category.code,
        name: category.name,
        productCount: category._count.products,
      })),
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, code } = body

    if (!name || !code) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and code are required',
        },
        { status: 400 }
      )
    }

    // Check if code already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        code: code
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category code already exists',
        },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        code,
        name,
      },
    })

    return NextResponse.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create category',
      },
      { status: 500 }
    )
  }
}