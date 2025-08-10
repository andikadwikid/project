import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all promo banners
export async function GET() {
  try {
    const banners = await prisma.promoBanner.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      banners
    })
  } catch (error) {
    console.error('Error fetching promo banners:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch promo banners' },
      { status: 500 }
    )
  }
}

// POST - Create new promo banner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subtitle, description, imageUrl, linkUrl, isActive, sortOrder } = body

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Title and image are required' },
        { status: 400 }
      )
    }

    const banner = await prisma.promoBanner.create({
      data: {
        title,
        subtitle: subtitle || null,
        description: description || null,
        imageUrl,
        linkUrl: linkUrl || null,
        isActive: isActive ?? true,
        sortOrder: sortOrder || 0
      }
    })

    return NextResponse.json({
      success: true,
      banner
    })
  } catch (error) {
    console.error('Error creating promo banner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create promo banner' },
      { status: 500 }
    )
  }
}