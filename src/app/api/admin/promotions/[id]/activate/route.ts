import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    const resolvedParams = await params
    try {
        const promotionId = parseInt(resolvedParams.id)
        
        if (isNaN(promotionId)) {
            return NextResponse.json(
                { error: 'Invalid promotion ID' },
                { status: 400 }
            )
        }

        // Check if promotion exists
        const existingPromotion = await prisma.promotion.findUnique({
            where: { id: promotionId }
        })

        if (!existingPromotion) {
            return NextResponse.json(
                { error: 'Promotion not found' },
                { status: 404 }
            )
        }

        // Activate promotion
        const promotion = await prisma.promotion.update({
            where: { id: promotionId },
            data: { isActive: true },
            include: {
                promoProducts: {
                    include: {
                        product: true
                    }
                },
                _count: {
                    select: {
                        promoProducts: true
                    }
                }
            }
        })

        return NextResponse.json({
            message: 'Promotion activated successfully',
            promotion
        })
    } catch (error) {
        console.error('Error activating promotion:', error)
        return NextResponse.json(
            { error: 'Failed to activate promotion' },
            { status: 500 }
        )
    }
}