import "dotenv/config";

import { prisma } from ".//src/config/prisma";

const categories = [
  "electronics",
  "computers",
  "footwear",
  "clothing",
  "television",
  "furniture",
  "books",
  "sports",
  "wearables",
];

const products = Array.from({ length: 200 }, (_, index) => ({
  name: `Product ${index + 1}`,
  price: Math.floor(Math.random() * 1900) + 50,
  category: categories[index % categories.length],
}));

async function main() {
  const result = await prisma.product.createMany({
    data: products,
  });

  console.log(`Inserted ${result.count} products`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });