import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, shareReplay, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiUrl = `${environment.apiUrl}/config`;

  private configSubject = new BehaviorSubject<any>(null);
  public config$ = this.configSubject.asObservable();
  private cachedConfig$: Observable<any> | null = null;

  constructor(private http: HttpClient) {
    this.loadConfig();
  }

  loadConfig() {
    this.getConfig().subscribe(data => {
      this.configSubject.next(data);
    });
  }

  getConfig(): Observable<any> {
    if (this.configSubject.value) {
      return of(this.configSubject.value);
    }
    if (!this.cachedConfig$) {
      this.cachedConfig$ = this.http.get<any>(this.apiUrl).pipe(
        tap(data => this.configSubject.next(data)),
        shareReplay(1)
      );
    }
    return this.cachedConfig$;
  }

  updateConfig(config: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, config).pipe(
      tap(updatedConfig => {
        this.configSubject.next(updatedConfig);
        this.cachedConfig$ = of(updatedConfig).pipe(shareReplay(1));
      })
    );
  }
}
