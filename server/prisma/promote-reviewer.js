import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.member.updateMany({
    where: { pcNumber: "PC-TEST01" },
    data: { isReviewer: true, isAdmin: true },
  });
  console.log("PC-TEST01 is now a reviewer + admin.");
}
main().finally(() => prisma.$disconnect());
