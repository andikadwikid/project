import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
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

        const promotion = await prisma.promotion.findUnique({
            where: { id: promotionId },
            include: {
                promoProducts: {
                    include: {
                        product: {
                            include: {
                                category: true,
                                brand: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        promoProducts: true
                    }
                }
            }
        })

        if (!promotion) {
            return NextResponse.json(
                { error: 'Promotion not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(promotion)
    } catch (error) {
        console.error('Error fetching promotion:', error)
        return NextResponse.json(
            { error: 'Failed to fetch promotion' },
            { status: 500 }
        )
    }
}

export async function PUT(
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

        const body = await request.json()
        const {
            title,
            description,
            discountType,
            discountValue,
            startDate,
            endDate,
            isActive,
            productIds = []
        } = body

        // Validate required fields
        if (!title || !discountType || !discountValue || !startDate || !endDate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
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

        // Validate discount type
        if (!['percentage', 'fixed'].includes(discountType)) {
            return NextResponse.json(
                { error: 'Invalid discount type. Must be "percentage" or "fixed"' },
                { status: 400 }
            )
        }

        // Validate dates
        const start = new Date(startDate)
        const end = new Date(endDate)
        if (start >= end) {
            return NextResponse.json(
                { error: 'End date must be after start date' },
                { status: 400 }
            )
        }

        // Update promotion and products
        await prisma.$transaction(async (tx) => {
            // Delete existing promo products
            await tx.promoProduct.deleteMany({
                where: { promotionId }
            })

            // Update promotion
            const updatedPromotion = await tx.promotion.update({
                where: { id: promotionId },
                data: {
                    title,
                    description,
                    discountType,
                    discountValue: parseFloat(discountValue),
                    startDate: start,
                    endDate: end,
                    isActive
                }
            })

            // Create new promo products
            if (productIds.length > 0) {
                await tx.promoProduct.createMany({
                    data: productIds.map((productId: number) => ({
                        promotionId,
                        productId
                    }))
                })
            }

            return updatedPromotion
        })

        // Fetch updated promotion with relations
        const updatedPromotion = await prisma.promotion.findUnique({
            where: { id: promotionId },
            include: {
                promoProducts: {
                    include: {
                        product: {
                            include: {
                                category: true,
                                brand: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        promoProducts: true
                    }
                }
            }
        })

        return NextResponse.json(updatedPromotion)
    } catch (error) {
        console.error('Error updating promotion:', error)
        return NextResponse.json(
            { error: 'Failed to update promotion' },
            { status: 500 }
        )
    }
}

export async function DELETE(
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

        // Soft delete by setting isActive to false
        await prisma.promotion.update({
            where: { id: promotionId },
            data: { isActive: false }
        })

        return NextResponse.json({ message: 'Promotion deactivated successfully' })
    } catch (error) {
        console.error('Error deleting promotion:', error)
        return NextResponse.json(
            { error: 'Failed to delete promotion' },
            { status: 500 }
        )
    }
}