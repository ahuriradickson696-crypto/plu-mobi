import { z } from "zod";

export const endorsementSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional().or(z.literal("")),
  memberId: z.string().optional(),
  assistedBy: z.string().optional(),
});
