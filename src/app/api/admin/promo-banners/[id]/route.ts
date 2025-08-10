import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch single promo banner
export async function GET(
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

    const banner = await prisma.promoBanner.findUnique({
      where: { id }
    })

    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      banner
    })
  } catch (error) {
    console.error('Error fetching promo banner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch promo banner' },
      { status: 500 }
    )
  }
}

// PUT - Update promo banner
export async function PUT(
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
    const { title, subtitle, description, imageUrl, linkUrl, isActive, sortOrder } = body

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Title and image are required' },
        { status: 400 }
      )
    }

    const banner = await prisma.promoBanner.update({
      where: { id },
      data: {
        title,
        subtitle: subtitle || null,
        description: description || null,
        imageUrl,
        linkUrl: linkUrl || null,
        isActive: isActive ?? true,
        sortOrder: sortOrder || 0,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      banner
    })
  } catch (error) {
    console.error('Error updating promo banner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update promo banner' },
      { status: 500 }
    )
  }
}

// DELETE - Delete promo banner
export async function DELETE(
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

    await prisma.promoBanner.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting promo banner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete promo banner' },
      { status: 500 }
    )
  }
}