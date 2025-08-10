import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    const status = searchParams.get('status') // 'active', 'inactive', 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: {
      isActive?: boolean;
      category?: { code: string };
      brand?: { code: string };
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
      }>;
    } = {}

    // Filter by status
    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }
    // If status is 'all' or not provided, don't filter by isActive

    if (category) {
      where.category = {
        code: category,
      }
    }

    if (brand) {
      where.brand = {
        code: brand,
      }
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ]
    }

    // Get products with relations
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          colors: {
            include: {
              color: true,
            },
          },
          sizes: {
            include: {
              size: true,
            },
            orderBy: {
              size: {
                sizeLabel: 'asc',
              },
            },
          },
          images: {
            include: {
              productColor: {
                include: {
                  color: true,
                },
              },
            },
            orderBy: [
              { isPrimary: 'desc' },
              { sortOrder: 'asc' },
            ],
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    // Transform data to match admin interface
    const transformedProducts = products.map((product) => ({
      id: product.id,
      code: product.code,
      name: product.name,
      description: product.description,
      brand: product.brand,
      category: product.category,
      price: Number(product.price),
      isActive: product.isActive,
      image: product.images.find(img => img.isPrimary && !img.productColorId)?.imageUrl || 
             product.images.find(img => img.isPrimary)?.imageUrl || 
             `/images/products/product-${product.id}.jpg`,
      colors: product.colors.map((productColor) => ({
        id: productColor.color.id,
        code: productColor.color.code,
        colorName: productColor.color.name,
        hexCode: productColor.color.hexCode || '#000000',
        imageUrl: productColor.imageUrl,
      })),
      sizes: product.sizes.map((sizePivot) => ({
        id: sizePivot.size.id,
        code: sizePivot.size.code,
        sizeLabel: sizePivot.size.sizeLabel,
        cmValue: sizePivot.size.cmValue,
      })),
      images: product.images.map((img) => img.imageUrl),
    }))

    return NextResponse.json({
      success: true,
      data: {
        products: transformedProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Error fetching admin products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    )
  }
}