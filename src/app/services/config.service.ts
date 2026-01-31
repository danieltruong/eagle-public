import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, ReplaySubject } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { LoadingStateService } from './loading-state.service';

interface EnvConfig {
  ENVIRONMENT?: string;
  BANNER_COLOUR?: string;
  API_PATH?: string;
  ADMIN_PATH?: string;
  SURVEY_URL?: string | null;
  SHOW_SURVEY_BANNER?: boolean;
  ANALYTICS_API_URL?: string;
  ANALYTICS_DEBUG?: boolean;
}

declare const window: Window & { __env?: EnvConfig };

//
// This service/class provides a centralized place to persist config values
// (eg, to share values between multiple components).
//

@Injectable({providedIn:'root'})
export class ConfigService {
  private http = inject(HttpClient);
  private loadingState = inject(LoadingStateService);

  // Environment configuration loaded from env.js
  private configuration: EnvConfig = {};


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
    // Load configuration from window.__env (set by env.js - generated at runtime for cluster builds)
    this.configuration = window.__env || {};
  }

  /**
   * Initialize the Config Service. Loads lists from the API.
   */
  public async init(): Promise<void> {
    const loadingId = 'config-lists';
    this.loadingState.startLoading(loadingId, 'Loading configuration');

    try {
      const apiPath = this.configuration.API_PATH || 'https://eagle-dev.apps.silver.devops.gov.bc.ca/api/public';
      const lists = await this.http.get<any>(`${apiPath}/search?pageSize=250&dataset=List`, {}).toPromise();
      if (lists && lists[0]) {
        this._lists = lists[0].searchResults;
        this._lists$.next(this._lists);
      }
    } catch (error) {
      console.error('Error loading lists:', error);
    } finally {
      this.loadingState.stopLoading(loadingId);
    }
  }

  // Expose configuration
  get config(): EnvConfig {
    return this.configuration;
  }

  // Legacy method - kept for backward compatibility but now handled by constructor
  private initializeLists(): void {
    const loadingId = 'config-lists-legacy';
    this.loadingState.startLoading(loadingId, 'Loading configuration');
    
    const apiPath = this.configuration.API_PATH || 'https://eagle-dev.apps.silver.devops.gov.bc.ca/api/public';
    this.http.get<any>(`${apiPath}/search?pageSize=250&dataset=List`, {})
      .pipe(
        take(1),
        map(res => {
          if (res) {
            this._lists = res[0].searchResults;
            this.loadingState.stopLoading(loadingId);
            return this._lists;
          }
          this.loadingState.stopLoading(loadingId);
          return null;
        }),
        catchError(error => {
          this.loadingState.stopLoading(loadingId);
          console.error('Error loading lists:', error);
          throw error;
        })
      )
      .subscribe(lists => {
        this._lists$.next(lists);
      });
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
