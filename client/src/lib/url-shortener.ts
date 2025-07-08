import { UrlEntry } from "@shared/schema";
import { Log } from "../../Logging Middleware/logger";

export function generateShortcode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function createShortUrl(
  originalUrl: string,
  shortcode: string,
  validityMinutes: number = 30
): UrlEntry {
  const now = new Date();
  const expiryTime = new Date(now.getTime() + validityMinutes * 60 * 1000);
  
  const urlEntry: UrlEntry = {
    id: `${shortcode}-${now.getTime()}`,
    originalUrl,
    shortcode,
    createdAt: now,
    expiryTime,
    validityMinutes,
    clickCount: 0,
    clicks: []
  };

  Log("url-shortener", "info", "url-shortener", `Created short URL: ${shortcode} -> ${originalUrl}`);
  
  return urlEntry;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidShortcode(shortcode: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(shortcode);
}
