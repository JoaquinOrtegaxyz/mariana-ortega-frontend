import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiUrl = 'http://localhost:8080/api/config';

  // Esto es lo que va a avisarle a toda la página si cambian el número
  private configSubject = new BehaviorSubject<any>(null);
  public config$ = this.configSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadConfig(); // Apenas abre la página, va a buscar los datos
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
