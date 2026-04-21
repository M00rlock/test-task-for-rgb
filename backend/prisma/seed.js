const { PrismaClient, DealStatus } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.deal.deleteMany();
  await prisma.client.deleteMany();

  const acme = await prisma.client.create({
    data: {
      name: "Acme Inc",
      email: "hello@acme.com",
      phone: "+380501112233"
    }
  });

  const northStar = await prisma.client.create({
    data: {
      name: "North Star Studio",
      email: "team@northstar.com"
    }
  });

  await prisma.deal.createMany({
    data: [
      {
        title: "Website redesign",
        amount: 2500,
        status: DealStatus.IN_PROGRESS,
        clientId: acme.id
      },
      {
        title: "Maintenance retainer",
        amount: 800,
        status: DealStatus.NEW,
        clientId: acme.id
      },
      {
        title: "Brand refresh",
        amount: 4300,
        status: DealStatus.WON,
        clientId: northStar.id
      }
    ]
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

