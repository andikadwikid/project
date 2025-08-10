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

    // Get products with relations including active promotions
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
          promoProducts: {
            include: {
              promotion: true,
            },
            where: {
              promotion: {
                isActive: true,
                startDate: { lte: new Date() },
                endDate: { gte: new Date() }
              }
            }
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
    const transformedProducts = products.map((product: {
      id: number;
      code: string;
      name: string;
      description: string | null;
      price: { toNumber(): number };
      brand?: { id: number; name: string; };
      brandId: number;
      category?: { id: number; name: string; };
      categoryId: number;
      images?: { isPrimary: boolean; productColorId?: number | null; imageUrl: string; }[];
      colors?: { color: { id: number; code: string; name: string; hexCode: string | null; }; }[];
      sizes?: { size: { id: number; code: string; sizeLabel: string; }; }[];
      promoProducts?: { promotion?: { id: number; title: string; discountType: string; discountValue: { toNumber(): number }; }; }[];
    }) => {
      // Calculate promo price and original price
      let promoPrice = null;
      const originalPrice = product.price.toNumber();
      let isSale = false;
      
      const activePromotion = product.promoProducts?.find((pp: { promotion?: { id: number; title: string; discountType: string; discountValue: { toNumber(): number } } }) => pp.promotion)?.promotion;
      
      if (activePromotion) {
        const basePrice = product.price.toNumber();
        
        if (activePromotion.discountType === 'percentage') {
          const discountAmount = (basePrice * activePromotion.discountValue.toNumber()) / 100;
          promoPrice = basePrice - discountAmount;
        } else if (activePromotion.discountType === 'fixed') {
          promoPrice = basePrice - activePromotion.discountValue.toNumber();
        }
        
        // Ensure promo price is not negative
        promoPrice = Math.max(0, promoPrice || 0);
        isSale = true;
      }
      
      return {
        id: product.id,
        code: product.code,
        name: product.name,
        description: product.description,
        brand: product.brand || { id: product.brandId, name: 'Unknown Brand' },
        category: product.category || { id: product.categoryId, name: 'Unknown Category' },
        price: promoPrice || product.price.toNumber(),
        originalPrice: originalPrice,
        image: product.images?.find((img: { isPrimary: boolean; productColorId?: number | null; imageUrl: string }) => img.isPrimary && !img.productColorId)?.imageUrl || 
               product.images?.find((img: { isPrimary: boolean; imageUrl: string }) => img.isPrimary)?.imageUrl || 
               `/images/products/product-${product.id}.jpg`, // Fallback image path
        rating: 4.5, // You can add rating system later
        reviews: 128, // You can add review system later
        isNew: false, // You can add logic for new products
        isSale: isSale,
        colors: product.colors?.map((productColor: { color: { id: number; code: string; name: string; hexCode: string | null; }; }) => ({
          id: productColor.color.id,
          code: productColor.color.code,
          colorName: productColor.color.name,
          hexCode: productColor.color.hexCode
        })) || [],
        sizes: product.sizes?.map((sizePivot: { size: { id: number; code: string; sizeLabel: string; }; }) => ({
          id: sizePivot.size.id,
          code: sizePivot.size.code,
          sizeLabel: sizePivot.size.sizeLabel
        })) || [],
        images: product.images?.map((img: { imageUrl: string }) => img.imageUrl) || [],
        promotion: activePromotion ? {
          id: activePromotion.id,
          title: activePromotion.title,
          discountType: activePromotion.discountType,
          discountValue: activePromotion.discountValue.toNumber()
        } : null
      }
    })

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