import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch active promo banners for frontend
export async function GET() {
  try {
    const banners = await prisma.promoBanner.findMany({
      where: {
        isActive: true
      },
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
    console.error('Error fetching active promo banners:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch promo banners' },
      { status: 500 }
    )
  }
}