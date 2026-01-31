import { Injectable, inject } from '@angular/core';
import Analytics from 'analytics';
import type { AnalyticsInstance } from 'analytics';
import { penguinAnalyticsPlugin } from './penguin-analytics-plugin';
import { ConfigService } from '../config.service';

interface PluginWithStartTracking {
  startTracking?: () => void;
}

/**
 * Analytics service for anonymous tracking (no PII).
 * Auto-tracks: page views, link clicks, button clicks, user activity.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private configService = inject(ConfigService);
  private analytics: AnalyticsInstance;
  private plugin: PluginWithStartTracking | null = null;

  constructor() {
    const config = this.configService.config;
    const apiUrl = config.ANALYTICS_API_URL || 'http://localhost:3000';
    const debug = config.ANALYTICS_DEBUG ?? (config.ENVIRONMENT === 'local');

    const plugin = penguinAnalyticsPlugin({ apiUrl, sourceApp: 'eagle-public', debug });
    this.plugin = plugin as unknown as PluginWithStartTracking;
    this.analytics = Analytics({ app: 'eagle-public', debug, plugins: [plugin] });
  }

  startTracking(): void {
    this.plugin?.startTracking?.();
  }

  page(name?: string, properties?: Record<string, unknown>): void {
    this.analytics.page({ name, ...properties });
  }

  track(event: string, properties?: Record<string, unknown>): void {
    this.analytics.track(event, properties);
  }

  reset(): void {
    this.analytics.reset();
  }
}
