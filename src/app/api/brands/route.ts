import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
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
      data: brands.map((brand) => ({
        id: brand.id,
        code: brand.code,
        name: brand.name,
        productCount: brand._count.products,
      })),
    })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch brands',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name is required',
        },
        { status: 400 }
      )
    }

    // Generate brand code
    const brandCount = await prisma.brand.count()
    const code = `BR-${String(brandCount + 1).padStart(3, '0')}`

    const brand = await prisma.brand.create({
      data: {
        code,
        name,
      },
    })

    return NextResponse.json({
      success: true,
      data: brand,
    })
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create brand',
      },
      { status: 500 }
    )
  }
}