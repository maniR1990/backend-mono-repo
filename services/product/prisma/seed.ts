import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randPrice(min = 5, max = 200) {
  const cents = randInt(min * 100, max * 100);
  return (cents / 100).toFixed(2); // string to avoid float precision
}

async function main() {
  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log(`[seed] Skipping: ${existing} products already exist.`);
    return;
  }

  const items = Array.from({ length: 100 }).map((_, i) => {
    const idx = (i + 1).toString().padStart(3, '0');
    const price = randPrice(5, 200);
    const stock = randInt(0, 100);
    return {
      name: `Product ${idx}`,
      imageUrl: `https://picsum.photos/seed/product-${idx}/400/300`,
      price: price,
      stock: stock,
      isActive: true,
    };
  });

  // Insert in batches to avoid large single request
  const batchSize = 25;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await prisma.product.createMany({ data: batch });
    console.log(`[seed] Inserted ${Math.min(i + batchSize, items.length)} / ${items.length}`);
  }

  console.log('[seed] Done: 100 products created.');
}

main()
  .catch((e) => {
    console.error('[seed] Failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
