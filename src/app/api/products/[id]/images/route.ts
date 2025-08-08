import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const images = await prisma.productImage.findMany({
      where: {
        productId: productId,
      },
      include: {
        color: {
          select: {
            id: true,
            colorName: true,
            hexCode: true,
          },
        },
      },
      orderBy: [
        { isPrimary: 'desc' },
        { sortOrder: 'asc' },
      ],
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching product images:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}