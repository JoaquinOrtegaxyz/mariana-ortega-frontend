import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiUrl = `${environment.apiUrl}/config`;

  private configSubject = new BehaviorSubject<any>(null);
  public config$ = this.configSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadConfig();
  }

  loadConfig() {
    this.http.get<any>(this.apiUrl).subscribe(data => {
      this.configSubject.next(data);
    });
  }

  getConfig(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateConfig(config: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, config).pipe(
      tap(updatedConfig => this.configSubject.next(updatedConfig))
    );
  }
}
