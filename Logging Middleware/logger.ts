type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: Date;
  stack: string;
  level: LogLevel;
  pkg: string;
  message: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

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

  private output(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const logMessage = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.pkg}] ${entry.stack}: ${entry.message}`;

    // In production, you might want to send logs to a service
    // For now, we'll use a custom logging approach that doesn't use console.log
    
    // Store in localStorage for debugging if needed
    try {
      const existingLogs = localStorage.getItem('url-shortener-logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(entry);
      
      // Keep only last 100 logs in localStorage
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('url-shortener-logs', JSON.stringify(logs));
    } catch (error) {
      // If localStorage fails, we can't do much without console.log
      // In a real production app, you'd send to a logging service
    }

    // For development, you could also display logs in the UI
    // or send them to a logging service
    this.displayInUI(logMessage);
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
