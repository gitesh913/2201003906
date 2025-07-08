type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: Date;
  stack: string;
  level: LogLevel;
  pkg: string;
  message: string;
}

interface AffordMedCredentials {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  public Log(stack: string, level: LogLevel, pkg: string, message: string): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      stack,
      level,
      pkg,
      message
    };

    this.logs.push(entry);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Format and output to appropriate destination
    this.output(entry);
  }

  private async authenticateAffordMed(): Promise<boolean> {
    // Check if we have valid credentials available
    const credentials = this.getAffordMedCredentials();
    if (!credentials) {
      return false;
    }

    // Check if current token is still valid
    const now = Date.now() / 1000;
    if (this.accessToken && this.tokenExpiry > now) {
      return true;
    }

    try {
      const response = await fetch('http://20.244.56.144/evaluation-service/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        this.accessToken = data.access_token;
        this.tokenExpiry = data.expires_in;
        return true;
      }
    } catch (error) {
      // Authentication failed, will fall back to local logging
    }
    
    return false;
  }

  private getAffordMedCredentials(): AffordMedCredentials | null {
    // Check if credentials are available in environment variables
    if (typeof window !== 'undefined') {
      return null; // Client-side, no environment variables
    }
    
    // Server-side environment variables (if available)
    const email = process.env.AFFORDMED_EMAIL;
    const name = process.env.AFFORDMED_NAME;
    const rollNo = process.env.AFFORDMED_ROLL_NO;
    const accessCode = process.env.AFFORDMED_ACCESS_CODE;
    const clientID = process.env.AFFORDMED_CLIENT_ID;
    const clientSecret = process.env.AFFORDMED_CLIENT_SECRET;

    if (email && name && rollNo && accessCode && clientID && clientSecret) {
      return { email, name, rollNo, accessCode, clientID, clientSecret };
    }
    
    return null;
  }

  private async sendToAffordMed(entry: LogEntry): Promise<boolean> {
    if (!this.accessToken) {
      return false;
    }

    try {
      const response = await fetch('http://20.244.56.144/evaluation-service/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          stack: entry.stack,
          level: entry.level,
          package: entry.pkg,
          message: entry.message,
        }),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  private async output(entry: LogEntry): Promise<void> {
    const timestamp = entry.timestamp.toISOString();
    const logMessage = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.pkg}] ${entry.stack}: ${entry.message}`;

    // Try to authenticate and send to AffordMed API
    const authenticated = await this.authenticateAffordMed();
    if (authenticated) {
      const sent = await this.sendToAffordMed(entry);
      if (sent) {
        // Successfully sent to AffordMed API
        this.storeLocalBackup(entry, 'sent-to-affordmed');
        return;
      }
    }

    // Fallback to local storage and UI display
    this.storeLocalBackup(entry, 'local-only');
    this.displayInUI(logMessage);
  }

  private storeLocalBackup(entry: LogEntry, status: string): void {
    try {
      const existingLogs = localStorage.getItem('url-shortener-logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push({ ...entry, status });
      
      // Keep only last 100 logs in localStorage
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('url-shortener-logs', JSON.stringify(logs));
    } catch (error) {
      // If localStorage fails, we can't do much without console.log
    }
  }

  private displayInUI(message: string): void {
    // Create a hidden log container for debugging
    let logContainer = document.getElementById('debug-logs');
    if (!logContainer) {
      logContainer = document.createElement('div');
      logContainer.id = 'debug-logs';
      logContainer.style.position = 'fixed';
      logContainer.style.bottom = '0';
      logContainer.style.right = '0';
      logContainer.style.maxWidth = '400px';
      logContainer.style.maxHeight = '200px';
      logContainer.style.overflow = 'auto';
      logContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
      logContainer.style.color = 'white';
      logContainer.style.fontSize = '10px';
      logContainer.style.padding = '10px';
      logContainer.style.zIndex = '9999';
      logContainer.style.display = 'none'; // Hidden by default
      document.body.appendChild(logContainer);
    }

    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    logContainer.appendChild(logEntry);

    // Keep only last 20 entries visible
    while (logContainer.children.length > 20) {
      logContainer.removeChild(logContainer.firstChild!);
    }
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('url-shortener-logs');
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Toggle debug log visibility for development
  public toggleDebugLogs(): void {
    const logContainer = document.getElementById('debug-logs');
    if (logContainer) {
      logContainer.style.display = logContainer.style.display === 'none' ? 'block' : 'none';
    }
  }
}

// Create singleton instance
const logger = new Logger();

// Export the Log function as required
export const Log = logger.Log.bind(logger);

// Export additional utility functions
export const getLogs = logger.getLogs.bind(logger);
export const clearLogs = logger.clearLogs.bind(logger);
export const exportLogs = logger.exportLogs.bind(logger);
export const toggleDebugLogs = logger.toggleDebugLogs.bind(logger);

// Add global access for debugging (can be removed in production)
if (typeof window !== 'undefined') {
  (window as any).urlShortenerLogger = {
    getLogs,
    clearLogs,
    exportLogs,
    toggleDebugLogs
  };
}
