import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sizes = await prisma.size.findMany({
      orderBy: {
        sizeLabel: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: sizes.map((size) => ({
        id: size.id,
        code: size.code,
        sizeLabel: size.sizeLabel,
        cmValue: size.cmValue,
      })),
    })
  } catch (error) {
    console.error('Error fetching sizes:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sizes',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sizeLabel, code, cmValue } = body

    if (!sizeLabel || !code) {
      return NextResponse.json(
        {
          success: false,
          error: 'Size label and code are required',
        },
        { status: 400 }
      )
    }

    // Check if size label already exists
    const existingSizeLabel = await prisma.size.findFirst({
      where: { sizeLabel },
    })

    if (existingSizeLabel) {
      return NextResponse.json(
        {
          success: false,
          error: 'Size label already exists',
        },
        { status: 400 }
      )
    }

    // Check if size code already exists
    const existingSizeCode = await prisma.size.findFirst({
      where: { code },
    })

    if (existingSizeCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Size code already exists',
        },
        { status: 400 }
      )
    }

    const size = await prisma.size.create({
      data: {
        sizeLabel,
        code,
        cmValue: cmValue || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: size,
    })
  } catch (error) {
    console.error('Error creating size:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create size',
      },
      { status: 500 }
    )
  }
}