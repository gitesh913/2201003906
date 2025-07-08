import { z } from "zod";

export const urlEntrySchema = z.object({
  id: z.string(),
  originalUrl: z.string().url(),
  shortcode: z.string().min(1),
  createdAt: z.date(),
  expiryTime: z.date(),
  validityMinutes: z.number().min(1).max(10080),
  clickCount: z.number().default(0),
  clicks: z.array(z.object({
    timestamp: z.date(),
    referrer: z.string().optional(),
    location: z.string(),
    userAgent: z.string().optional()
  })).default([])
});

export const urlFormSchema = z.object({
  longUrl: z.string().url("Please enter a valid URL"),
  validityMinutes: z.number().min(1).max(10080).optional(),
  customShortcode: z.string().regex(/^[a-zA-Z0-9]*$/, "Shortcode must be alphanumeric").optional()
});

export type UrlEntry = z.infer<typeof urlEntrySchema>;
export type UrlFormData = z.infer<typeof urlFormSchema>;
export type ClickData = UrlEntry['clicks'][0];
