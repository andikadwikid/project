import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: {
      isActive: boolean;
      category?: { code: string };
      brand?: { code: string };
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
      }>;
    } = {
      isActive: true,
    }

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
          colors: true,
          sizes: {
            orderBy: {
              sizeLabel: 'asc',
            },
          },
          images: {
            include: {
              color: true,
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

    // Transform data to match frontend interface
    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      brand: product.brand.name,
      category: product.category.name,
      price: Number(product.price),
      originalPrice: null, // You can add this field to schema if needed
      image: product.images.find(img => img.isPrimary && !img.colorId)?.imageUrl || 
             product.images.find(img => img.isPrimary)?.imageUrl || 
             `/images/products/product-${product.id}.jpg`, // Fallback image path
      rating: 4.5, // You can add rating system later
      reviews: 128, // You can add review system later
      isNew: false, // You can add logic for new products
      isSale: false, // You can add sale logic
      colors: product.colors.map((color) => ({
        name: color.colorName,
        value: color.hexCode || '#000000',
      })),
      sizes: product.sizes.map((size) => ({
        name: size.sizeLabel,
      })),
      images: product.images.map((img) => img.imageUrl),
    }))

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      categoryCode,
      brandCode,
      price,
      colors = [],
      sizes = [],
    } = body

    // Validate required fields
    if (!name || !categoryCode || !brandCode || !price) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, categoryCode, brandCode, price',
        },
        { status: 400 }
      )
    }

    // Find category and brand
    const [category, brand] = await Promise.all([
      prisma.category.findUnique({ where: { code: categoryCode } }),
      prisma.brand.findUnique({ where: { code: brandCode } }),
    ])

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      )
    }

    if (!brand) {
      return NextResponse.json(
        {
          success: false,
          error: 'Brand not found',
        },
        { status: 404 }
      )
    }

    // Generate product code
    const productCount = await prisma.product.count()
    const productCode = `PRD-${String(productCount + 1).padStart(3, '0')}`

    // Create product with colors and sizes
    const product = await prisma.product.create({
      data: {
        code: productCode,
        name,
        description,
        categoryId: category.id,
        brandId: brand.id,
        price,
        colors: {
          create: colors.map((color: { name: string; value: string }, index: number) => ({
            code: `CLR-${String(Date.now() + index).slice(-6)}`,
            colorName: color.name,
            hexCode: color.value,
          })),
        },
        sizes: {
          create: sizes.map((size: string, index: number) => ({
            code: `SIZ-${String(Date.now() + index).slice(-6)}`,
            sizeLabel: size,
            cmValue: 22 + (parseInt(size) - 36) * 0.5, // Approximate conversion
          })),
        },
      },
      include: {
        category: true,
        brand: true,
        colors: true,
        sizes: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create product',
      },
      { status: 500 }
    )
  }
}