import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, ReplaySubject, firstValueFrom } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { LoadingStateService } from './loading-state.service';

interface EnvConfig {
  logLevel?: number;
  configEndpoint?: boolean;
  ENVIRONMENT?: string;
  BANNER_COLOUR?: string;
  API_PATH?: string;
  API_LOCATION?: string;
  ADMIN_PATH?: string;
  SURVEY_URL?: string | null;
  SHOW_SURVEY_BANNER?: boolean;
  ANALYTICS_API_URL?: string | null;
  ANALYTICS_DEBUG?: boolean;
  GH_HASH?: string;
}

// env.js sets window.__env before Angular loads
declare global {
  interface Window { __env: EnvConfig; }
}

//
// This service/class provides a centralized place to persist config values
// (eg, to share values between multiple components).
//

@Injectable({providedIn:'root'})
export class ConfigService {
  private http = inject(HttpClient);
  private loadingState = inject(LoadingStateService);

  // Environment configuration
  private configuration: EnvConfig = {};
  private configLoaded = false;

  // defaults
  private _isApplistListVisible = false;
  private _isApplistFiltersVisible = false;
  private _listPageSize = 10;
  private _lists = [];
  private _lists$ = new ReplaySubject<any>(1);

  // TODO: store these in URL instead
  private _baseLayerName = 'World Topographic'; // NB: must match a valid base layer name
  private _mapBounds: any = null;

  constructor() {
    // No pre-initialization needed - config comes from env.js then optionally API
  }

  /**
   * Initialize the Config Service.
   * Get configuration from env.js first, then from API if configEndpoint is true.
   * Pattern follows reserve-rec-public.
   */
  public async init(): Promise<void> {
    const loadingId = 'config-init';
    this.loadingState.startLoading(loadingId, 'Loading configuration');

    try {
      // Start with env.js values (loaded before Angular via script tag in index.html)
      this.configuration = window.__env || {};
      
      if (this.configuration.logLevel === 0) {
        console.log('Initial configuration from env.js:', this.configuration);
      }

      // If configEndpoint is true (deployed environments), fetch config from API
      if (this.configuration.configEndpoint === true) {
        try {
          const apiConfig = await this.getConfigFromApi();
          // Merge API config (API values take precedence)
          this.configuration = { ...this.configuration, ...apiConfig };
        } catch (e) {
          // If API fails, continue with env.js values
          console.error('Error getting API configuration, using env.js defaults:', e);
        }
      }
      
      this.configLoaded = true;
      
      if (this.configuration.logLevel === 0) {
        console.log('Final configuration:', this.configuration);
      }
      
      // Now load lists using the configured API path
      const apiPath = this.getApiPath();
      const lists = await firstValueFrom(
        this.http.get<any>(`${apiPath}/search?pageSize=250&dataset=List`)
      );
      if (lists && lists[0]) {
        this._lists = lists[0].searchResults;
        this._lists$.next(this._lists);
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
    } finally {
      this.loadingState.stopLoading(loadingId);
    }
  }

  /**
   * Get the API path for making API calls.
   * Uses API_LOCATION + API_PATH, otherwise falls back to relative /api.
   */
  private getApiPath(): string {
    if (this.configuration.API_LOCATION) {
      return this.configuration.API_LOCATION + (this.configuration.API_PATH || '');
    }
    // Fallback to relative path (for deployed environments with nginx proxy)
    return '/api';
  }

  /**
   * Fetch configuration from API endpoint.
   * Retries with fibonacci backoff if API is unavailable.
   */
  private async getConfigFromApi(): Promise<EnvConfig> {
    let n1 = 0;
    let n2 = 1;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts) {
      try {
        const headers = new HttpHeaders().set('Authorization', 'config');
        // Use API_LOCATION if set, otherwise relative /api/config (nginx proxies in deployed env)
        const url = (this.configuration.API_LOCATION || '') + '/api/config';
        
        const response = await firstValueFrom(
          this.http.get<any>(url, { headers, observe: 'response' })
        );
        return response.body?.data || response.body;
      } catch (err) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw err;
        }
        console.log(`Config API attempt ${attempts} failed, retrying...`);
        const delay = n1 + n2;
        await this.delay(delay * 1000);
        n1 = n2;
        n2 = delay;
      }
    }
    throw new Error('Failed to load config from API');
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  get logLevel(): number {
    // Can be overridden by js console
    return window.__env?.logLevel ?? 4;
  }

  // Expose configuration
  get config(): EnvConfig {
    return this.configuration;
  }

  get isConfigLoaded(): boolean {
    return this.configLoaded;
  }

  // called by app constructor - for future use
  public destroy() {
    // FUTURE: save settings to window.localStorage ?
  }

  get lists(): Observable<any> {
    return this._lists$.asObservable();
  }

  get isApplistListVisible(): boolean { return this._isApplistListVisible; }
  set isApplistListVisible(val: boolean) { this._isApplistListVisible = val; }

  get isApplistFiltersVisible(): boolean { return this._isApplistFiltersVisible; }
  set isApplistFiltersVisible(val: boolean) { this._isApplistFiltersVisible = val; }

  get listPageSize(): number { return this._listPageSize; }
  set listPageSize(val: number) { this._listPageSize = val; }

  get baseLayerName(): string { return this._baseLayerName; }
  set baseLayerName(val: string) { this._baseLayerName = val; }

  get mapBounds(): any { return this._mapBounds; }
  set mapBounds(val: any) { this._mapBounds = val; }

}
