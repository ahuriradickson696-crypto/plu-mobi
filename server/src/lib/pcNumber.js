import prisma from "./prisma.js";

export async function generatePcNumber() {
  for (let i = 0; i < 10; i++) {
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    const pc = `PC-${rand}`;
    const exists = await prisma.member.findUnique({ where: { pcNumber: pc } });
    if (!exists) return pc;
  }
  throw new Error("Could not generate unique PC number");
}
