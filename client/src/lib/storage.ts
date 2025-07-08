import { UrlEntry } from "@shared/schema";
import { Log } from "../../../Logging Middleware/logger";

const STORAGE_KEY = 'url-shortener-entries';

export function saveUrlEntry(entry: UrlEntry): void {
  try {
    const entries = getAllUrlEntries();
    const existingIndex = entries.findIndex(e => e.shortcode === entry.shortcode);
    
    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    Log("storage", "info", "url-shortener", `Saved URL entry: ${entry.shortcode}`);
  } catch (error) {
    Log("storage", "error", "url-shortener", `Failed to save URL entry: ${error}`);
    throw new Error('Failed to save URL entry to localStorage');
  }
}

export function getUrlEntry(shortcode: string): UrlEntry | null {
  try {
    const entries = getAllUrlEntries();
    const entry = entries.find(e => e.shortcode === shortcode);
    
    if (entry) {
      // Convert date strings back to Date objects
      entry.createdAt = new Date(entry.createdAt);
      entry.expiryTime = new Date(entry.expiryTime);
      entry.clicks = entry.clicks.map(click => ({
        ...click,
        timestamp: new Date(click.timestamp)
      }));
    }
    
    return entry || null;
  } catch (error) {
    Log("storage", "error", "url-shortener", `Failed to get URL entry: ${error}`);
    return null;
  }
}

export function getAllUrlEntries(): UrlEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const entries = JSON.parse(stored) as UrlEntry[];
    
    // Convert date strings back to Date objects
    return entries.map(entry => ({
      ...entry,
      createdAt: new Date(entry.createdAt),
      expiryTime: new Date(entry.expiryTime),
      clicks: entry.clicks.map(click => ({
        ...click,
        timestamp: new Date(click.timestamp)
      }))
    }));
  } catch (error) {
    Log("storage", "error", "url-shortener", `Failed to get all URL entries: ${error}`);
    return [];
  }
}

export function updateUrlEntry(entry: UrlEntry): void {
  try {
    const entries = getAllUrlEntries();
    const index = entries.findIndex(e => e.shortcode === entry.shortcode);
    
    if (index >= 0) {
      entries[index] = entry;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      Log("storage", "info", "url-shortener", `Updated URL entry: ${entry.shortcode}`);
    }
  } catch (error) {
    Log("storage", "error", "url-shortener", `Failed to update URL entry: ${error}`);
    throw new Error('Failed to update URL entry in localStorage');
  }
}

export function deleteUrlEntry(shortcode: string): void {
  try {
    const entries = getAllUrlEntries();
    const filteredEntries = entries.filter(e => e.shortcode !== shortcode);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
    Log("storage", "info", "url-shortener", `Deleted URL entry: ${shortcode}`);
  } catch (error) {
    Log("storage", "error", "url-shortener", `Failed to delete URL entry: ${error}`);
    throw new Error('Failed to delete URL entry from localStorage');
  }
}

export function clearAllUrlEntries(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    Log("storage", "info", "url-shortener", "Cleared all URL entries");
  } catch (error) {
    Log("storage", "error", "url-shortener", `Failed to clear all URL entries: ${error}`);
    throw new Error('Failed to clear all URL entries from localStorage');
  }
}
