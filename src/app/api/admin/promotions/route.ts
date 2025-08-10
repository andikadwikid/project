import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const promotions = await prisma.promotion.findMany({
            include: {
                _count: {
                    select: {
                        promoProducts: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({
            success: true,
            data: promotions
        })
    } catch (error) {
        console.error('Error fetching promotions:', error)
        return NextResponse.json(
            { error: 'Failed to fetch promotions' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            title,
            description,
            discountType,
            discountValue,
            startDate,
            endDate,
            isActive = true,
            productIds = []
        } = body

        // Validate required fields
        if (!title || !discountType || !discountValue || !startDate || !endDate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
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

        // Create promotion with products
        const promotion = await prisma.promotion.create({
            data: {
                title,
                description,
                discountType,
                discountValue: parseFloat(discountValue),
                startDate: start,
                endDate: end,
                isActive,
                promoProducts: {
                    create: productIds.map((productId: number) => ({
                        productId
                    }))
                }
            },
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

        return NextResponse.json(promotion, { status: 201 })
    } catch (error) {
        console.error('Error creating promotion:', error)
        return NextResponse.json(
            { error: 'Failed to create promotion' },
            { status: 500 }
        )
    }
}