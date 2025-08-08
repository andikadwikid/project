import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        code: "CAT-001",
        name: "Running Shoes",
      },
    }),
    prisma.category.create({
      data: {
        code: "CAT-002",
        name: "Casual Shoes",
      },
    }),
    prisma.category.create({
      data: {
        code: "CAT-003",
        name: "Formal Shoes",
      },
    }),
    prisma.category.create({
      data: {
        code: "CAT-004",
        name: "Sports Shoes",
      },
    }),
  ]);

  // Create Brands
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        code: "BR-001",
        name: "Nike",
      },
    }),
    prisma.brand.create({
      data: {
        code: "BR-002",
        name: "Adidas",
      },
    }),
    prisma.brand.create({
      data: {
        code: "BR-003",
        name: "Puma",
      },
    }),
    prisma.brand.create({
      data: {
        code: "BR-004",
        name: "Converse",
      },
    }),
    prisma.brand.create({
      data: {
        code: "BR-005",
        name: "Vans",
      },
    }),
  ]);

  // Create Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        code: "PRD-001",
        name: "Nike Air Max 270",
        description: "Comfortable running shoes with air cushioning technology",
        categoryId: categories[0].id, // Running Shoes
        brandId: brands[0].id, // Nike
        price: 1299000,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        code: "PRD-002",
        name: "Adidas Ultraboost 22",
        description: "Premium running shoes with boost technology",
        categoryId: categories[0].id, // Running Shoes
        brandId: brands[1].id, // Adidas
        price: 1599000,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        code: "PRD-003",
        name: "Converse Chuck Taylor All Star",
        description: "Classic casual sneakers for everyday wear",
        categoryId: categories[1].id, // Casual Shoes
        brandId: brands[3].id, // Converse
        price: 699000,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        code: "PRD-004",
        name: "Vans Old Skool",
        description: "Iconic skate shoes with classic side stripe",
        categoryId: categories[1].id, // Casual Shoes
        brandId: brands[4].id, // Vans
        price: 899000,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        code: "PRD-005",
        name: "Puma Future Z 1.1",
        description: "Professional football boots for optimal performance",
        categoryId: categories[3].id, // Sports Shoes
        brandId: brands[2].id, // Puma
        price: 2199000,
        isActive: true,
      },
    }),
  ]);

  // Create Product Colors
  const productColors = await Promise.all([
    // Nike Air Max 270 colors
    prisma.productColor.create({
      data: {
        code: "CLR-001",
        productId: products[0].id,
        colorName: "Black/White",
        hexCode: "#000000",
      },
    }),
    prisma.productColor.create({
      data: {
        code: "CLR-002",
        productId: products[0].id,
        colorName: "Blue/White",
        hexCode: "#0066CC",
      },
    }),
    // Adidas Ultraboost 22 colors
    prisma.productColor.create({
      data: {
        code: "CLR-003",
        productId: products[1].id,
        colorName: "Core Black",
        hexCode: "#000000",
      },
    }),
    prisma.productColor.create({
      data: {
        code: "CLR-004",
        productId: products[1].id,
        colorName: "Cloud White",
        hexCode: "#FFFFFF",
      },
    }),
    // Converse Chuck Taylor colors
    prisma.productColor.create({
      data: {
        code: "CLR-005",
        productId: products[2].id,
        colorName: "Classic Black",
        hexCode: "#000000",
      },
    }),
    prisma.productColor.create({
      data: {
        code: "CLR-006",
        productId: products[2].id,
        colorName: "Optical White",
        hexCode: "#FFFFFF",
      },
    }),
    prisma.productColor.create({
      data: {
        code: "CLR-007",
        productId: products[2].id,
        colorName: "Red",
        hexCode: "#FF0000",
      },
    }),
  ]);

  // Create Product Sizes
  await Promise.all([
    // Sizes for all products (36-44)
    ...products.flatMap((product, productIndex) =>
      [36, 37, 38, 39, 40, 41, 42, 43, 44].map((size, sizeIndex) =>
        prisma.productSize.create({
          data: {
            code: `SIZ-${String(productIndex * 10 + sizeIndex + 1).padStart(
              3,
              "0"
            )}`,
            productId: product.id,
            sizeLabel: size.toString(),
            cmValue: 22 + (size - 36) * 0.5, // Approximate cm conversion
          },
        })
      )
    ),
  ]);

  // Create Product Images
  await Promise.all([
    // Nike Air Max 270 images
    prisma.productImage.create({
      data: {
        productId: products[0].id,
        colorId: productColors[0].id, // White/Black color
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[0].id,
        colorId: productColors[0].id,
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: false,
        sortOrder: 2,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[0].id,
        colorId: productColors[1].id, // Triple Black color
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),

    // Adidas Ultraboost 22 images
    prisma.productImage.create({
      data: {
        productId: products[1].id,
        colorId: productColors[2].id, // Core Black color
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[1].id,
        colorId: productColors[3].id, // Cloud White color
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),

    // Converse Chuck Taylor images
    prisma.productImage.create({
      data: {
        productId: products[2].id,
        colorId: productColors[4].id, // Classic Black color
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[2].id,
        colorId: productColors[5].id, // Optical White color
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[2].id,
        colorId: productColors[6].id, // Red color
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: true,
        sortOrder: 1,
      },
    }),

    // General product images (without specific color)
    prisma.productImage.create({
      data: {
        productId: products[0].id,
        colorId: null,
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: false,
        sortOrder: 10,
      },
    }),
    prisma.productImage.create({
      data: {
        productId: products[1].id,
        colorId: null,
        imageUrl: "/images/products/black-pumps.svg",
        isPrimary: false,
        sortOrder: 10,
      },
    }),
  ]);

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
