import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiBaseUrl: string = 'api/home/apiRoutes';
  constructor(private readonly _http: HttpClient) { };

  getGoogleMapsApiKeyAngular(): Observable<string> {
    return this._http.get<string>(`${this.apiBaseUrl}`).pipe(
      catchError(this.handleServiceApiErrors<string>('getGoogleMapsApiKeyAngularTwo', ''))
    );
  };


  private handleServiceApiErrors<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  };
};
