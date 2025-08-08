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

    if (!sizeLabel) {
      return NextResponse.json(
        {
          success: false,
          error: 'Size label is required',
        },
        { status: 400 }
      )
    }

    // Generate code if not provided
    const sizeCode = code || `SIZE-${Date.now()}`

    const size = await prisma.size.create({
      data: {
        sizeLabel,
        code: sizeCode,
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