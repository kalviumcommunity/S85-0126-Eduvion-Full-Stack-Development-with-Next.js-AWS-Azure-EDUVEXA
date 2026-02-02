import { logger } from './logger';

export interface MetricData {
  name: string;
  value: number;
  unit?: string;
  tags?: Record<string, string>;
  timestamp?: string;
}

export interface AlertConfig {
  name: string;
  threshold: number;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  metricName: string;
  enabled: boolean;
  cooldownPeriod?: number; // in seconds
}

class MetricsCollector {
  private metrics: Map<string, MetricData[]> = new Map();
  private alerts: Map<string, AlertConfig> = new Map();
  private alertCooldowns: Map<string, number> = new Map();

  // Record a metric
  recordMetric(metric: MetricData): void {
    const metricName = metric.name;
    const timestampedMetric = {
      ...metric,
      timestamp: metric.timestamp || new Date().toISOString(),
    };

    if (!this.metrics.has(metricName)) {
      this.metrics.set(metricName, []);
    }

    const metricArray = this.metrics.get(metricName)!;
    metricArray.push(timestampedMetric);

    // Keep only last 1000 data points per metric to prevent memory leaks
    if (metricArray.length > 1000) {
      metricArray.splice(0, metricArray.length - 1000);
    }

    // Check alerts
    this.checkAlerts(metricName, timestampedMetric.value);

    // Log metric for cloud monitoring
    logger.info('Metric recorded', {
      metric: metricName,
      value: metric.value,
      unit: metric.unit,
      tags: metric.tags,
    });
  }

  // Get metric statistics
  getMetricStats(metricName: string, timeWindow?: number): {
    count: number;
    sum: number;
    average: number;
    min: number;
    max: number;
  } | null {
    const metricData = this.metrics.get(metricName);
    if (!metricData || metricData.length === 0) {
      return null;
    }

    let filteredData = metricData;
    
    if (timeWindow) {
      const cutoffTime = new Date(Date.now() - timeWindow * 1000);
      filteredData = metricData.filter(m => new Date(m.timestamp!) >= cutoffTime);
    }

    if (filteredData.length === 0) {
      return null;
    }

    const values = filteredData.map(m => m.value);
    const sum = values.reduce((acc, val) => acc + val, 0);

    return {
      count: values.length,
      sum,
      average: sum / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  // Configure an alert
  configureAlert(alert: AlertConfig): void {
    this.alerts.set(alert.name, alert);
    logger.info('Alert configured', {
      alertName: alert.name,
      metricName: alert.metricName,
      threshold: alert.threshold,
      operator: alert.operator,
    });
  }

  // Check if any alerts should be triggered
  private checkAlerts(metricName: string, value: number): void {
    for (const [alertName, alert] of this.alerts) {
      if (alert.metricName !== metricName || !alert.enabled) {
        continue;
      }

      // Check cooldown period
      const cooldownKey = `${alertName}_${metricName}`;
      const lastTriggered = this.alertCooldowns.get(cooldownKey) || 0;
      const cooldownPeriod = (alert.cooldownPeriod || 300) * 1000; // Default 5 minutes

      if (Date.now() - lastTriggered < cooldownPeriod) {
        continue;
      }

      // Check threshold
      let shouldTrigger = false;

      switch (alert.operator) {
        case 'gt':
          shouldTrigger = value > alert.threshold;
          break;
        case 'gte':
          shouldTrigger = value >= alert.threshold;
          break;
        case 'lt':
          shouldTrigger = value < alert.threshold;
          break;
        case 'lte':
          shouldTrigger = value <= alert.threshold;
          break;
        case 'eq':
          shouldTrigger = value === alert.threshold;
          break;
      }

      if (shouldTrigger) {
        this.triggerAlert(alert, value);
        this.alertCooldowns.set(cooldownKey, Date.now());
      }
    }
  }

  // Trigger an alert
  private triggerAlert(alert: AlertConfig, value: number): void {
    logger.warn('Alert triggered', {
      alertName: alert.name,
      metricName: alert.metricName,
      threshold: alert.threshold,
      currentValue: value,
      operator: alert.operator,
      timestamp: new Date().toISOString(),
    });

    // In a real implementation, you would send notifications here
    // e.g., email, Slack, PagerDuty, etc.
    this.sendNotification(alert, value);
  }

  // Send notification (placeholder implementation)
  private sendNotification(alert: AlertConfig, value: number): void {
    // This would integrate with your notification service
    logger.info('Notification sent', {
      alertName: alert.name,
      message: `Alert: ${alert.name} - ${alert.metricName} is ${value} (threshold: ${alert.threshold})`,
    });
  }

  // Get all metrics
  getAllMetrics(): Record<string, MetricData[]> {
    const result: Record<string, MetricData[]> = {};
    for (const [name, data] of this.metrics) {
      result[name] = [...data];
    }
    return result;
  }

  // Clear old metrics (cleanup)
  clearOldMetrics(retentionPeriod: number = 3600): void {
    const cutoffTime = new Date(Date.now() - retentionPeriod * 1000);
    
    for (const [metricName, metricData] of this.metrics) {
      const filteredData = metricData.filter(m => new Date(m.timestamp!) >= cutoffTime);
      this.metrics.set(metricName, filteredData);
    }

    logger.info('Old metrics cleared', {
      retentionPeriod,
      metricsCount: this.metrics.size,
    });
  }
}

// Create singleton instance
export const metricsCollector = new MetricsCollector();

// Predefined metrics
export const METRICS = {
  API_REQUEST_COUNT: 'api_request_count',
  API_RESPONSE_TIME: 'api_response_time',
  API_ERROR_COUNT: 'api_error_count',
  DATABASE_QUERY_TIME: 'database_query_time',
  DATABASE_ERROR_COUNT: 'database_error_count',
  AUTH_SUCCESS_COUNT: 'auth_success_count',
  AUTH_FAILURE_COUNT: 'auth_failure_count',
  ACTIVE_USERS: 'active_users',
  MEMORY_USAGE: 'memory_usage',
  CPU_USAGE: 'cpu_usage',
} as const;

// Predefined alerts
export const DEFAULT_ALERTS: AlertConfig[] = [
  {
    name: 'High API Response Time',
    threshold: 2000, // 2 seconds
    operator: 'gt',
    metricName: METRICS.API_RESPONSE_TIME,
    enabled: true,
    cooldownPeriod: 300, // 5 minutes
  },
  {
    name: 'High API Error Rate',
    threshold: 10, // 10 errors in the collection window
    operator: 'gt',
    metricName: METRICS.API_ERROR_COUNT,
    enabled: true,
    cooldownPeriod: 300,
  },
  {
    name: 'High Database Query Time',
    threshold: 1000, // 1 second
    operator: 'gt',
    metricName: METRICS.DATABASE_QUERY_TIME,
    enabled: true,
    cooldownPeriod: 300,
  },
  {
    name: 'High Auth Failure Rate',
    threshold: 5, // 5 failed auth attempts
    operator: 'gt',
    metricName: METRICS.AUTH_FAILURE_COUNT,
    enabled: true,
    cooldownPeriod: 600, // 10 minutes
  },
];

// Configure default alerts
DEFAULT_ALERTS.forEach(alert => {
  metricsCollector.configureAlert(alert);
});

// Utility function to record API metrics
export function recordApiMetrics(
  method: string,
  endpoint: string,
  responseTime: number,
  statusCode: number,
  requestId?: string
): void {
  // Record request count
  metricsCollector.recordMetric({
    name: METRICS.API_REQUEST_COUNT,
    value: 1,
    tags: {
      method,
      endpoint,
      status_code: statusCode.toString(),
    },
  });

  // Record response time
  metricsCollector.recordMetric({
    name: METRICS.API_RESPONSE_TIME,
    value: responseTime,
    unit: 'ms',
    tags: {
      method,
      endpoint,
      status_code: statusCode.toString(),
    },
  });

  // Record error if applicable
  if (statusCode >= 400) {
    metricsCollector.recordMetric({
      name: METRICS.API_ERROR_COUNT,
      value: 1,
      tags: {
        method,
        endpoint,
        status_code: statusCode.toString(),
        error_type: statusCode >= 500 ? 'server_error' : 'client_error',
      },
    });
  }

  logger.info('API metrics recorded', {
    method,
    endpoint,
    responseTime,
    statusCode,
    requestId,
  });
}

// Utility function to record database metrics
export function recordDatabaseMetrics(
  operation: string,
  table: string,
  queryTime: number,
  success: boolean,
  requestId?: string
): void {
  // Record query time
  metricsCollector.recordMetric({
    name: METRICS.DATABASE_QUERY_TIME,
    value: queryTime,
    unit: 'ms',
    tags: {
      operation,
      table,
      success: success.toString(),
    },
  });

  // Record error if applicable
  if (!success) {
    metricsCollector.recordMetric({
      name: METRICS.DATABASE_ERROR_COUNT,
      value: 1,
      tags: {
        operation,
        table,
      },
    });
  }

  logger.info('Database metrics recorded', {
    operation,
    table,
    queryTime,
    success,
    requestId,
  });
}

// Utility function to record auth metrics
export function recordAuthMetrics(
  event: string,
  success: boolean,
  userId?: string,
  requestId?: string
): void {
  const metricName = success ? METRICS.AUTH_SUCCESS_COUNT : METRICS.AUTH_FAILURE_COUNT;
  
  metricsCollector.recordMetric({
    name: metricName,
    value: 1,
    tags: {
      event,
      user_id: userId || 'anonymous',
    },
  });

  logger.info('Auth metrics recorded', {
    event,
    success,
    userId,
    requestId,
  });
}
