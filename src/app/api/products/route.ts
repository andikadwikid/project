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

    // Transform data to match frontend interface
    const transformedProducts = products.map((product) => ({
      id: product.id,
      code: product.code,
      name: product.name,
      description: product.description,
      brand: product.brand,
      category: product.category,
      price: Number(product.price),
      originalPrice: null, // You can add this field to schema if needed
      image: product.images.find(img => img.isPrimary && !img.productColorId)?.imageUrl || 
             product.images.find(img => img.isPrimary)?.imageUrl || 
             `/images/products/product-${product.id}.jpg`, // Fallback image path
      rating: 4.5, // You can add rating system later
      reviews: 128, // You can add review system later
      isNew: false, // You can add logic for new products
      isSale: false, // You can add sale logic
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
      categoryId,
      brandId,
      price,
      colorIds = [],
      sizes = [],
      images = [],
      isActive = true
    } = body

    // Validate required fields
    if (!name || !categoryId || !brandId || !price) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, categoryId, brandId, price',
        },
        { status: 400 }
      )
    }

    // Generate product code
    const productCount = await prisma.product.count()
    const productCode = `PRD-${String(productCount + 1).padStart(3, '0')}`

    // Create product
    const product = await prisma.product.create({
      data: {
        code: productCode,
        name,
        description,
        categoryId: parseInt(categoryId),
        brandId: parseInt(brandId),
        price: parseFloat(price),
        isActive
      }
    })

    // Associate colors with product
    if (colorIds.length > 0) {
      await Promise.all(
        colorIds.map((colorId: number) =>
          prisma.productColor.create({
            data: {
              productId: product.id,
              colorId: colorId
            }
          })
        )
      )
    }

    // Associate sizes with product
    if (sizes.length > 0) {
      await Promise.all(
        sizes.map((size: { id: number; cmValue?: number }) =>
          prisma.productSizePivot.create({
            data: {
              productId: product.id,
              sizeId: size.id,
              cmValue: size.cmValue
            }
          })
        )
      )
    }

    // Create product images
    if (images.length > 0) {
      await Promise.all(
        images.map((imageUrl: string, index: number) =>
          prisma.productImage.create({
            data: {
              productId: product.id,
              imageUrl,
              isPrimary: index === 0,
              sortOrder: index + 1
            }
          })
        )
      )
    }

    // Fetch the complete product with relations
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        brand: true,
        colors: true,
        sizes: {
          include: {
            size: true,
          },
        },
        images: true
      }
    })

    return NextResponse.json({
      success: true,
      data: completeProduct,
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