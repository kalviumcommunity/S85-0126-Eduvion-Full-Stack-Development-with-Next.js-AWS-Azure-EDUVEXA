import { randomBytes } from 'crypto';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  requestId?: string;
  userId?: string;
  endpoint?: string;
  method?: string;
  message: string;
  error?: string;
  stack?: string;
  metadata?: Record<string, any>;
  service: string;
  environment: string;
  responseTime?: number;
}

class Logger {
  private service: string;
  private environment: string;

  constructor(service: string = 'eduvexa') {
    this.service = service;
    this.environment = process.env.NODE_ENV || 'development';
  }

  private generateRequestId(): string {
    return randomBytes(16).toString('hex');
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    options: Partial<LogEntry> = {}
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.service,
      environment: this.environment,
      ...options,
    };
  }

  private log(entry: LogEntry): void {
    const logMessage = JSON.stringify(entry);
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(logMessage);
        break;
      case LogLevel.INFO:
        console.log(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.ERROR:
        console.error(logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }

  debug(message: string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, { metadata });
    this.log(entry);
  }

  info(message: string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, { metadata });
    this.log(entry);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, { metadata });
    this.log(entry);
  }

  error(message: string, error?: Error | string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.ERROR, message, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      metadata,
    });
    this.log(entry);
  }

  // API-specific logging methods
  logApiRequest(
    method: string,
    endpoint: string,
    requestId: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    const entry = this.createLogEntry(LogLevel.INFO, 'API request received', {
      requestId,
      userId,
      endpoint,
      method,
      metadata,
    });
    this.log(entry);
  }

  logApiSuccess(
    method: string,
    endpoint: string,
    requestId: string,
    responseTime?: number,
    metadata?: Record<string, any>
  ): void {
    const entry = this.createLogEntry(LogLevel.INFO, 'API request processed successfully', {
      requestId,
      endpoint,
      method,
      responseTime,
      metadata,
    });
    this.log(entry);
  }

  logApiError(
    method: string,
    endpoint: string,
    requestId: string,
    error: Error | string,
    metadata?: Record<string, any>
  ): void {
    const entry = this.createLogEntry(LogLevel.ERROR, 'Error processing API request', {
      requestId,
      endpoint,
      method,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      metadata,
    });
    this.log(entry);
  }

  logDatabaseOperation(
    operation: string,
    table: string,
    requestId?: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    const entry = this.createLogEntry(LogLevel.INFO, `Database operation: ${operation}`, {
      requestId,
      userId,
      metadata: {
        table,
        ...metadata,
      },
    });
    this.log(entry);
  }

  logDatabaseError(
    operation: string,
    table: string,
    error: Error | string,
    requestId?: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    const entry = this.createLogEntry(LogLevel.ERROR, `Database error during ${operation}`, {
      requestId,
      userId,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      metadata: {
        table,
        ...metadata,
      },
    });
    this.log(entry);
  }

  logAuthEvent(
    event: string,
    userId?: string,
    requestId?: string,
    metadata?: Record<string, any>
  ): void {
    const entry = this.createLogEntry(LogLevel.INFO, `Auth event: ${event}`, {
      requestId,
      userId,
      metadata,
    });
    this.log(entry);
  }

  logAuthError(
    event: string,
    error: Error | string,
    userId?: string,
    requestId?: string,
    metadata?: Record<string, any>
  ): void {
    const entry = this.createLogEntry(LogLevel.ERROR, `Auth error during ${event}`, {
      requestId,
      userId,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      metadata,
    });
    this.log(entry);
  }

  // Utility method to create request context
  createRequestContext(): {
    requestId: string;
    startTime: number;
  } {
    return {
      requestId: this.generateRequestId(),
      startTime: Date.now(),
    };
  }

  // Utility method to calculate response time
  getResponseTime(startTime: number): number {
    return Date.now() - startTime;
  }
}

// Create and export singleton instance
export const logger = new Logger();
