const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
(async () => {
  const members = await p.member.findMany({ where: { photoPath: { not: null } } });
  let updated = 0;
  for (const m of members) {
    if (m.photoPath && !m.photoPath.startsWith("/uploads/")) {
      await p.member.update({
        where: { id: m.id },
        data: { photoPath: "/uploads/photos/" + m.photoPath }
      });
      updated++;
    }
  }
  console.log(`Backfilled ${updated} members`);
  await p.$disconnect();
})();
