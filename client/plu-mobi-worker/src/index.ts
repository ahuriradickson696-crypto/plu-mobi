import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export interface Env {
    DATABASE_URL: string;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
        const prisma = new PrismaClient({ adapter });

        try {
            await prisma.$queryRaw`SELECT 1`;
            return new Response(JSON.stringify({ ok: true, db: "connected" }), {
                headers: { "Content-Type": "application/json" },
            });
        } catch (e) {
            return new Response(JSON.stringify({ ok: false, error: String(e) }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    },
};
