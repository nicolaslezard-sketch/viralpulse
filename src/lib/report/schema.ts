import { z } from "zod";
import { REPORT_SECTIONS } from "./sectionNames";

const sectionsShape = Object.fromEntries(
  REPORT_SECTIONS.map((k) => [k, z.string()]),
);

export const ViralReportJsonSchema = z.object({
  sections: z.object(sectionsShape as Record<string, z.ZodTypeAny>),
  metrics: z.object({
    hookStrength: z.number().min(0).max(100),
    retentionPotential: z.number().min(0).max(100),
    emotionalImpact: z.number().min(0).max(100),
    shareability: z.number().min(0).max(100),
    finalScore: z.number().min(0).max(100),
  }),
});

export type ViralReportJson = z.infer<typeof ViralReportJsonSchema>;
