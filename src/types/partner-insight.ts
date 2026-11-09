import { z } from "zod";

export const partnerInsightSchema = z.object({
  dayInCycle: z.number().default(1),
  name: z.string().default(""),
  description: z.string().default(""),
});

export type PartnerInsight = z.infer<typeof partnerInsightSchema>;
