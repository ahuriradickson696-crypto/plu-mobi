import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding synthetic prototype data...");

  const officers = [
    { poNumber: "PO-100001", name: "Test Officer Alpha",   role: "District Coordinator", location: "Kampala" },
    { poNumber: "PO-100002", name: "Test Officer Bravo",   role: "Regional Lead",        location: "Gulu" },
    { poNumber: "PO-100003", name: "Test Officer Charlie", role: "Field Liaison",        location: "Mbarara" },
  ];
  for (const o of officers) {
    await prisma.patrioticOfficer.upsert({
      where: { poNumber: o.poNumber },
      update: {},
      create: o,
    });
  }

  const pinHash = await bcrypt.hash("123456", 10);
  await prisma.member.upsert({
    where: { pcNumber: "PC-TEST01" },
    update: {},
    create: {
      pcNumber: "PC-TEST01",
      phone: "+256700000001",
      email: "test.member@plu-mobi.test",
      name: "Test Member One",
      pathway: "UGANDA",
      location: "Kampala",
      status: "TENTATIVE",
      pinHash,
    },
  });

  console.log("Seed complete. Demo login: +256700000001 / PIN 123456");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
