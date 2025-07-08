// This is a simple in-memory storage interface
// For the URL shortener, we mainly use localStorage on the client side
export interface IStorage {
  // Empty interface for now, can be extended later
}

export class MemStorage implements IStorage {
  constructor() {
    // Basic storage implementation
  }
}

export const storage = new MemStorage();