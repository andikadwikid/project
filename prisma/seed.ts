import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Categories
  console.log('📂 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        code: "SNEAKERS",
        name: "Sneakers",
      },
    }),
    prisma.category.create({
      data: {
        code: "FORMAL",
        name: "Formal Shoes",
      },
    }),
    prisma.category.create({
      data: {
        code: "CASUAL",
        name: "Casual Shoes",
      },
    }),
    prisma.category.create({
      data: {
        code: "SPORTS",
        name: "Sports Shoes",
      },
    }),
    prisma.category.create({
      data: {
        code: "BOOTS",
        name: "Boots",
      },
    }),
  ]);

  // Create Brands
  console.log('🏷️ Creating brands...');
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        code: "NIKE",
        name: "Nike",
      },
    }),
    prisma.brand.create({
      data: {
        code: "ADIDAS",
        name: "Adidas",
      },
    }),
    prisma.brand.create({
      data: {
        code: "CONVERSE",
        name: "Converse",
      },
    }),
    prisma.brand.create({
      data: {
        code: "VANS",
        name: "Vans",
      },
    }),
    prisma.brand.create({
      data: {
        code: "PUMA",
        name: "Puma",
      },
    }),
    prisma.brand.create({
      data: {
        code: "NEWBALANCE",
        name: "New Balance",
      },
    }),
  ]);

  // Create Master Sizes
  console.log('📏 Creating master sizes...');
  const sizes = await Promise.all([
    ...Array.from({ length: 9 }, (_, i) => {
      const sizeNumber = 36 + i;
      return prisma.size.create({
        data: {
          code: `SIZE-${sizeNumber}`,
          sizeLabel: sizeNumber.toString(),
          cmValue: 22 + (sizeNumber - 36) * 0.5, // Approximate cm conversion
        },
      });
    }),
  ]);

  // Create Products
  console.log('👟 Creating products...');
  const products = await Promise.all([
    // Nike Products
    prisma.product.create({
      data: {
        code: "PRD-001",
        name: "Nike Air Max 270",
        description: "The Nike Air Max 270 delivers visible cushioning under every step. The design draws inspiration from the Air Max 93 and Air Max 180, featuring Nike's largest heel Air unit yet for a super-soft ride that feels as impossible as it looks.",
        categoryId: categories[0].id, // Sneakers
        brandId: brands[0].id, // Nike
        price: 150.00,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        code: "PRD-002",
        name: "Nike Air Force 1 '07",
        description: "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.",
        categoryId: categories[0].id, // Sneakers
        brandId: brands[0].id, // Nike
        price: 110.00,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        code: "PRD-003",
        name: "Nike React Infinity Run Flyknit 3",
        description: "A comfortable, reliable shoe that's engineered to help keep you running. A refreshed upper uses Flyknit technology for support and breathability where you need it.",
        categoryId: categories[3].id, // Sports
        brandId: brands[0].id, // Nike
        price: 160.00,
        isActive: true,
      },
    }),

    // Adidas Products
    prisma.product.create({
      data: {
        code: "PRD-004",
        name: "Adidas Ultraboost 22",
        description: "These adidas running shoes return energy with every step. The responsive Boost midsole is paired with a Primeknit+ upper that adapts to your foot for a supportive feel.",
        categoryId: categories[3].id, // Sports
        brandId: brands[1].id, // Adidas
        price: 190.00,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        code: "PRD-005",
        name: "Adidas Stan Smith",
        description: "Clean and simple. The Stan Smith shoes are a timeless icon reimagined for today. This pair honors the legacy with the same minimalist design and premium leather upper.",
        categoryId: categories[2].id, // Casual
        brandId: brands[1].id, // Adidas
        price: 80.00,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        code: "PRD-006",
        name: "Adidas Gazelle",
        description: "Born on the training grounds and perfected on the streets. The Gazelle shoes started life as a training shoe and grew into an iconic streetwear staple.",
        categoryId: categories[0].id, // Sneakers
        brandId: brands[1].id, // Adidas
        price: 90.00,
        isActive: true,
      },
    }),

    // Converse Products
    prisma.product.create({
      data: {
        code: "PRD-007",
        name: "Converse Chuck Taylor All Star Classic",
        description: "The first basketball shoe becomes the last word in street style. The Converse Chuck Taylor All Star sneaker keeps your look fresh with classic canvas construction and a timeless silhouette.",
        categoryId: categories[0].id, // Sneakers
        brandId: brands[2].id, // Converse
        price: 55.00,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        code: "PRD-008",
        name: "Converse Chuck 70 High Top",
        description: "The Chuck 70 is built off of the original 1970s design, with premium materials and an extraordinary attention to detail. A shoe so rooted in tradition that it has its own instant history.",
        categoryId: categories[0].id, // Sneakers
        brandId: brands[2].id, // Converse
        price: 85.00,
        isActive: true,
      },
    }),

    // Vans Products
    prisma.product.create({
      data: {
        code: "PRD-009",
        name: "Vans Old Skool",
        description: "The Old Skool was our first footwear design to showcase the famous Vans Sidestripe—although back then, it was just a simple doodle drawn by founder Paul Van Doren.",
        categoryId: categories[0].id, // Sneakers
        brandId: brands[3].id, // Vans
        price: 65.00,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        code: "PRD-010",
        name: "Vans Authentic",
        description: "The Vans Authentic was our first shoe and continues to be a favorite for its simple design and versatile style. This low-top lace-up has a timeless appeal and is a blank canvas for self-expression.",
        categoryId: categories[2].id, // Casual
        brandId: brands[3].id, // Vans
        price: 50.00,
        isActive: true,
      },
    }),
  ]);

  // Create Master Colors
  console.log('🎨 Creating master colors...');
  const colors = await Promise.all([
    prisma.color.create({
      data: {
        code: "BLACK",
        name: "Black",
        hexCode: "#000000",
      },
    }),
    prisma.color.create({
      data: {
        code: "WHITE",
        name: "White",
        hexCode: "#FFFFFF",
      },
    }),
    prisma.color.create({
      data: {
        code: "RED",
        name: "Red",
        hexCode: "#FF0000",
      },
    }),
    prisma.color.create({
      data: {
        code: "BLUE",
        name: "Blue",
        hexCode: "#0000FF",
      },
    }),
    prisma.color.create({
      data: {
        code: "GREEN",
        name: "Green",
        hexCode: "#008000",
      },
    }),
    prisma.color.create({
      data: {
        code: "NAVY",
        name: "Navy",
        hexCode: "#000080",
      },
    }),
  ]);

  // Create Product Colors
  console.log('🎨 Creating product colors...');
  const productColors = await Promise.all([
    // Nike Air Max 270 colors
    prisma.productColor.create({
      data: {
        productId: products[0].id,
        colorId: colors[0].id, // Black
        imageUrl: "/images/products/nike-air-max-270-black.jpg",
      },
    }),
    prisma.productColor.create({
      data: {
        productId: products[0].id,
        colorId: colors[1].id, // White
        imageUrl: "/images/products/nike-air-max-270-white.jpg",
      },
    }),
    prisma.productColor.create({
      data: {
        productId: products[0].id,
        colorId: colors[2].id, // Red
        imageUrl: "/images/products/nike-air-max-270-red.jpg",
      },
    }),

    // Nike Air Force 1 colors
    prisma.productColor.create({
      data: {
        productId: products[1].id,
        colorId: colors[1].id, // White
        imageUrl: "/images/products/nike-air-force-1-white.jpg",
      },
    }),
    prisma.productColor.create({
      data: {
        productId: products[1].id,
        colorId: colors[0].id, // Black
        imageUrl: "/images/products/nike-air-force-1-black.jpg",
      },
    }),

    // Adidas Ultraboost 22 colors
    prisma.productColor.create({
      data: {
        productId: products[3].id,
        colorId: colors[0].id, // Black
        imageUrl: "/images/products/adidas-ultraboost-black.jpg",
      },
    }),
    prisma.productColor.create({
      data: {
        productId: products[3].id,
        colorId: colors[1].id, // White
        imageUrl: "/images/products/adidas-ultraboost-white.jpg",
      },
    }),

    // Adidas Stan Smith colors
    prisma.productColor.create({
      data: {
        productId: products[4].id,
        colorId: colors[4].id, // Green
        imageUrl: "/images/products/adidas-stan-smith-white-green.jpg",
      },
    }),

    // Converse Chuck Taylor colors
    prisma.productColor.create({
      data: {
        productId: products[6].id,
        colorId: colors[0].id, // Black
        imageUrl: "/images/products/converse-chuck-taylor-black.jpg",
      },
    }),
    prisma.productColor.create({
      data: {
        productId: products[6].id,
        colorId: colors[1].id, // White
        imageUrl: "/images/products/converse-chuck-taylor-white.jpg",
      },
    }),
    prisma.productColor.create({
      data: {
        productId: products[6].id,
        colorId: colors[2].id, // Red
        imageUrl: "/images/products/converse-chuck-taylor-red.jpg",
      },
    }),

    // Vans Old Skool colors
    prisma.productColor.create({
      data: {
        productId: products[8].id,
        colorId: colors[0].id, // Black
        imageUrl: "/images/products/vans-old-skool-black.jpg",
      },
    }),
    prisma.productColor.create({
      data: {
        productId: products[8].id,
        colorId: colors[5].id, // Navy
        imageUrl: "/images/products/vans-old-skool-navy.jpg",
      },
    }),
  ]);

  // Create Product Size Pivot (associate all sizes with all products)
  console.log('🔗 Creating product-size associations...');
  const productSizePivots = [];
  for (const product of products) {
    for (const size of sizes) {
      productSizePivots.push(
        prisma.productSizePivot.create({
          data: {
            productId: product.id,
            sizeId: size.id,
          },
        })
      );
    }
  }
  await Promise.all(productSizePivots);

  // Create Product Images
  console.log('🖼️ Creating product images...');
  await Promise.all([
    // Nike Air Max 270 images
    prisma.productImage.create({
      data: {
        productId: products[0].id,
        productColorId: productColors[0].id, // Black color
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[0].id,
        productColorId: productColors[0].id,
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: false,
        sortOrder: 2,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[0].id,
        productColorId: productColors[1].id, // White color
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),

    // Nike Air Force 1 images
    prisma.productImage.create({
      data: {
        productId: products[1].id,
        productColorId: productColors[3].id, // White
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[1].id,
        productColorId: productColors[4].id, // Black
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),

    // Adidas Ultraboost 22 images
    prisma.productImage.create({
      data: {
        productId: products[3].id,
        productColorId: productColors[5].id, // Black
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[3].id,
        productColorId: productColors[6].id, // White
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),

    // Adidas Stan Smith images
    prisma.productImage.create({
      data: {
        productId: products[4].id,
        productColorId: productColors[7].id, // Green
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),

    // Converse Chuck Taylor images
    prisma.productImage.create({
      data: {
        productId: products[6].id,
        productColorId: productColors[8].id, // Black
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[6].id,
        productColorId: productColors[9].id, // White
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[6].id,
        productColorId: productColors[10].id, // Red
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),

    // Vans Old Skool images
    prisma.productImage.create({
      data: {
        productId: products[8].id,
        productColorId: productColors[11].id, // Black
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[8].id,
        productColorId: productColors[12].id, // Navy
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),

    // General product images (without specific color)
    prisma.productImage.create({
      data: {
        productId: products[2].id, // Nike React Infinity Run
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[5].id, // Adidas Gazelle
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[7].id, // Converse Chuck 70
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[9].id, // Vans Authentic
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),
  ]);

  // Create Size Templates
  console.log('📏 Creating size templates...');
  const sizeTemplates = await Promise.all([
    prisma.sizeTemplate.create({
      data: {
        name: "Men's Standard Sizes",
        description: "Standard sizing template for men's shoes",
        isActive: true,
        templateSizes: {
          create: [
            { sizeId: sizes.find(s => s.sizeLabel === '39')?.id || 1, cmValue: 25.0, sortOrder: 1 },
            { sizeId: sizes.find(s => s.sizeLabel === '40')?.id || 2, cmValue: 25.5, sortOrder: 2 },
            { sizeId: sizes.find(s => s.sizeLabel === '41')?.id || 3, cmValue: 26.0, sortOrder: 3 },
            { sizeId: sizes.find(s => s.sizeLabel === '42')?.id || 4, cmValue: 26.5, sortOrder: 4 },
            { sizeId: sizes.find(s => s.sizeLabel === '43')?.id || 5, cmValue: 27.0, sortOrder: 5 },
            { sizeId: sizes.find(s => s.sizeLabel === '44')?.id || 6, cmValue: 27.5, sortOrder: 6 },
          ]
        }
      }
    }),
    prisma.sizeTemplate.create({
      data: {
        name: "Women's Standard Sizes",
        description: "Standard sizing template for women's shoes",
        isActive: true,
        templateSizes: {
          create: [
            { sizeId: sizes.find(s => s.sizeLabel === '36')?.id || 1, cmValue: 23.0, sortOrder: 1 },
            { sizeId: sizes.find(s => s.sizeLabel === '37')?.id || 2, cmValue: 23.5, sortOrder: 2 },
            { sizeId: sizes.find(s => s.sizeLabel === '38')?.id || 3, cmValue: 24.0, sortOrder: 3 },
            { sizeId: sizes.find(s => s.sizeLabel === '39')?.id || 4, cmValue: 24.5, sortOrder: 4 },
            { sizeId: sizes.find(s => s.sizeLabel === '40')?.id || 5, cmValue: 25.0, sortOrder: 5 },
            { sizeId: sizes.find(s => s.sizeLabel === '41')?.id || 6, cmValue: 25.5, sortOrder: 6 },
          ]
        }
      }
    }),
    prisma.sizeTemplate.create({
      data: {
        name: "Kids Standard Sizes",
        description: "Standard sizing template for children's shoes",
        isActive: true,
        templateSizes: {
          create: [
            { sizeId: sizes.find(s => s.sizeLabel === '28')?.id || 1, cmValue: 17.5, sortOrder: 1 },
            { sizeId: sizes.find(s => s.sizeLabel === '29')?.id || 2, cmValue: 18.0, sortOrder: 2 },
            { sizeId: sizes.find(s => s.sizeLabel === '30')?.id || 3, cmValue: 18.5, sortOrder: 3 },
            { sizeId: sizes.find(s => s.sizeLabel === '31')?.id || 4, cmValue: 19.0, sortOrder: 4 },
            { sizeId: sizes.find(s => s.sizeLabel === '32')?.id || 5, cmValue: 19.5, sortOrder: 5 },
            { sizeId: sizes.find(s => s.sizeLabel === '33')?.id || 6, cmValue: 20.0, sortOrder: 6 },
            { sizeId: sizes.find(s => s.sizeLabel === '34')?.id || 7, cmValue: 20.5, sortOrder: 7 },
            { sizeId: sizes.find(s => s.sizeLabel === '35')?.id || 8, cmValue: 21.0, sortOrder: 8 },
          ]
        }
      }
    }),
    prisma.sizeTemplate.create({
      data: {
        name: "Athletic Performance",
        description: "Performance sizing for athletic and sports shoes",
        isActive: true,
        templateSizes: {
          create: [
            { sizeId: sizes.find(s => s.sizeLabel === '40')?.id || 1, cmValue: 25.8, sortOrder: 1 },
            { sizeId: sizes.find(s => s.sizeLabel === '41')?.id || 2, cmValue: 26.3, sortOrder: 2 },
            { sizeId: sizes.find(s => s.sizeLabel === '42')?.id || 3, cmValue: 26.8, sortOrder: 3 },
            { sizeId: sizes.find(s => s.sizeLabel === '43')?.id || 4, cmValue: 27.3, sortOrder: 4 },
            { sizeId: sizes.find(s => s.sizeLabel === '44')?.id || 5, cmValue: 27.8, sortOrder: 5 },
          ]
        }
      }
    })
  ]);

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${brands.length} brands`);
  console.log(`   - ${colors.length} master colors`);
  console.log(`   - ${sizes.length} sizes`);
  console.log(`   - ${products.length} products`);
  console.log(`   - ${productColors.length} product colors`);
  console.log(`   - ${productSizePivots.length} product-size associations`);
  console.log(`   - ${sizeTemplates.length} size templates`);
  console.log(`   - Multiple product images`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

console.log('Database seeded successfully!');
