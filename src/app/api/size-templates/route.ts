import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch all size templates
export async function GET() {
  try {
    const templates = await prisma.sizeTemplate.findMany({
      where: {
        isActive: true
      },
      include: {
        templateSizes: {
          include: {
            size: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: templates
    })
  } catch (error) {
    console.error('Error fetching size templates:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch size templates'
      },
      { status: 500 }
    )
  }
}

// POST - Create new size template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, templateSizes } = body

    if (!name || !templateSizes || !Array.isArray(templateSizes)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and template sizes are required'
        },
        { status: 400 }
      )
    }

    const template = await prisma.sizeTemplate.create({
      data: {
        name,
        description,
        templateSizes: {
          create: templateSizes.map((size: { sizeId: number; cmValue: string | number }, index: number) => ({
            sizeId: size.sizeId,
            cmValue: parseFloat(size.cmValue.toString()),
            sortOrder: index + 1
          }))
        }
      },
      include: {
        templateSizes: {
          include: {
            size: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: template
    })
  } catch (error) {
    console.error('Error creating size template:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create size template'
      },
      { status: 500 }
    )
  }
}