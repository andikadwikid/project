import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedSizeTemplates() {
  console.log('📏 Starting size templates seeding...');

  // Get existing sizes
  const sizes = await prisma.size.findMany();
  console.log(`Found ${sizes.length} existing sizes`);

  // Check if templates already exist
  const existingTemplates = await prisma.sizeTemplate.findMany();
  if (existingTemplates.length > 0) {
    console.log('⚠️ Size templates already exist. Skipping seeding.');
    return;
  }

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

  console.log('✅ Size templates seeding completed successfully!');
  console.log(`📊 Created ${sizeTemplates.length} size templates:`);
  sizeTemplates.forEach(template => {
    console.log(`   - ${template.name}`);
  });
}

seedSizeTemplates()
  .catch((e) => {
    console.error('❌ Error during size templates seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });