import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Toggle banner status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid banner ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { isActive } = body

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isActive must be a boolean' },
        { status: 400 }
      )
    }

    const banner = await prisma.promoBanner.update({
      where: { id },
      data: {
        isActive,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      banner
    })
  } catch (error) {
    console.error('Error toggling banner status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to toggle banner status' },
      { status: 500 }
    )
  }
}