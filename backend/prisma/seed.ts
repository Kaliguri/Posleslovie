import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.contentPage.upsert({
    where: { slug: "home-hero" },
    update: {
      title: "Главный экран",
      data: {
        heading: "Послесловие к вашему дню",
        leadLine1: "Энергия природы в каждой бомбочке для ванны",
        leadLine2: "Внимание и забота к каждой минуте наедине с собой",
        ctaLabel: "Оформить заказ",
      },
    },
    create: {
      slug: "home-hero",
      title: "Главный экран",
      data: {
        heading: "Послесловие к вашему дню",
        leadLine1: "Энергия природы в каждой бомбочке для ванны",
        leadLine2: "Внимание и забота к каждой минуте наедине с собой",
        ctaLabel: "Оформить заказ",
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
