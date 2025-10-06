/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-console */
/**
 * File-based logging utility
 * Logs to files instead of console for production debugging
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context?: string;
  message: string;
  data?: unknown;
}

class Logger {
  private logDir: string;
  private isServer: boolean;

  constructor() {
    this.isServer = typeof window === 'undefined';
    if (this.isServer) {
      // Only require path on server
      const path = require('path');
      this.logDir = path.join(process.cwd(), 'logs');
    } else {
      this.logDir = '';
    }
  }

  /**
   * Ensures log directory exists
   */
  private async ensureLogDir(): Promise<void> {
    if (!this.isServer) return;

    try {
      const { mkdir } = await import('fs/promises');
      await mkdir(this.logDir, { recursive: true });
    } catch {
      // Directory might already exist, ignore error
    }
  }

  /**
   * Formats log entry as JSON
   */
  private formatEntry(entry: LogEntry): string {
    return JSON.stringify(entry) + '\n';
  }

  /**
   * Gets log file path for current date
   */
  private getLogFilePath(level: LogLevel): string {
    if (!this.isServer) return '';
    const path = require('path');
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(this.logDir, `${date}-${level}.log`);
  }

  /**
   * Writes log entry to file
   */
  private async writeLog(level: LogLevel, message: string, context?: string, data?: unknown): Promise<void> {
    // Client-side: fall back to console in development
    if (!this.isServer) {
      if (process.env.NODE_ENV === 'development') {
        const prefix = context ? `[${context}]` : '';
        console[level === 'debug' ? 'log' : level](`${prefix} ${message}`, data || '');
      }
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
    };

    try {
      await this.ensureLogDir();
      const logFile = this.getLogFilePath(level);
      const { appendFile } = await import('fs/promises');
      await appendFile(logFile, this.formatEntry(entry));
    } catch (error) {
      // Fallback to console if file writing fails
      console.error('Failed to write to log file:', error);
      console[level](`[${context}] ${message}`, data || '');
    }
  }

  /**
   * Log info message
   */
  async info(message: string, context?: string, data?: unknown): Promise<void> {
    await this.writeLog('info', message, context, data);
  }

  /**
   * Log warning message
   */
  async warn(message: string, context?: string, data?: unknown): Promise<void> {
    await this.writeLog('warn', message, context, data);
  }

  /**
   * Log error message
   */
  async error(message: string, context?: string, data?: unknown): Promise<void> {
    await this.writeLog('error', message, context, data);
  }

  /**
   * Log debug message (only in development)
   */
  async debug(message: string, context?: string, data?: unknown): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      await this.writeLog('debug', message, context, data);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience methods for common patterns (async)
export const log = {
  info: (message: string, context?: string, data?: unknown) => logger.info(message, context, data),
  warn: (message: string, context?: string, data?: unknown) => logger.warn(message, context, data),
  error: (message: string, context?: string, data?: unknown) => logger.error(message, context, data),
  debug: (message: string, context?: string, data?: unknown) => logger.debug(message, context, data),
};

// Synchronous versions for non-async contexts (client components, sync functions)
// Note: These fire-and-forget, no error handling
export const logSync = {
  info: (message: string, context?: string, data?: unknown) => {
    logger.info(message, context, data).catch(() => {});
  },
  warn: (message: string, context?: string, data?: unknown) => {
    logger.warn(message, context, data).catch(() => {});
  },
  error: (message: string, context?: string, data?: unknown) => {
    logger.error(message, context, data).catch(() => {});
  },
  debug: (message: string, context?: string, data?: unknown) => {
    logger.debug(message, context, data).catch(() => {});
  },
};
