import { z } from "zod";

export const projectSchema = z.object({
  titleRu: z.string().min(2).max(120),
  titleEn: z.string().min(2).max(120),
  excerptRu: z.string().min(10).max(240),
  excerptEn: z.string().min(10).max(240),
  descriptionRu: z.string().min(20),
  descriptionEn: z.string().min(20),
  author: z.enum(["artem", "nikita"]),
  tags: z.array(z.string().min(1).max(24)).max(10),
  projectDate: z.string().date().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "hidden"])
});

export const contentSchema = z.object({
  studioName: z.string().min(2).max(120),
  heroTitleRu: z.string().min(4).max(180),
  heroTitleEn: z.string().min(4).max(180),
  heroSubtitleRu: z.string().min(4).max(200),
  heroSubtitleEn: z.string().min(4).max(200),
  aboutTextRu: z.string().min(12),
  aboutTextEn: z.string().min(12),
  strengthsRu: z.string().min(8),
  strengthsEn: z.string().min(8),
  workFormatRu: z.string().min(8),
  workFormatEn: z.string().min(8),
  contactEmail: z.string().email()
});

export const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  message: z.string().min(10).max(2500),
  locale: z.enum(["ru", "en"]),
  hp: z.string().optional()
});
