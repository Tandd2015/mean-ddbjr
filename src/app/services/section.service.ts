import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SectionApp } from '../models';


@Injectable({
  providedIn: 'root'
})
export class SectionService {

  private readonly sectionBaseUrl = '/api/home/sections';

  constructor(private readonly _http: HttpClient) { };

  getSections(): Observable<SectionApp[]> {
    return this._http.get<SectionApp[]>(`${this.sectionBaseUrl}/all`).pipe(
      catchError(this.handleServiceSectionErrors<SectionApp[]>('getSections', []))
    );
  };

  createSection(section: SectionApp, file: File): Observable<any> {
    const newSectionFormEnd: FormData = new FormData();
    newSectionFormEnd.append('title', section.title);
    newSectionFormEnd.append('content', section.content);
    newSectionFormEnd.append('sectionImageAttributionCredit', section.sectionImageAttributionCredit);
    newSectionFormEnd.append('sectionImageAttributionLink', section.sectionImageAttributionLink);
    newSectionFormEnd.append('sectionImage', file);
    const header: HttpHeaders = new HttpHeaders();
    const params: HttpParams = new HttpParams();
    const options = {
      params,
      reportProgress: false,
      headers: header
    };
    const request = new HttpRequest('POST', this.sectionBaseUrl, newSectionFormEnd, options);
    return this._http.request<any>(request).pipe(
      catchError(this.handleServiceSectionErrors<any>(`createSection`))
    );
  };

  getSection(sectionId: string): Observable<SectionApp> {
    return this._http.get<SectionApp>(`${this.sectionBaseUrl}/single/${sectionId}`).pipe(
      catchError(this.handleServiceSectionErrors<SectionApp>(`getSection id=${sectionId}`))
    );
  };

  updateSection(section: SectionApp): Observable<SectionApp> {
    return this._http.put<SectionApp>(`${this.sectionBaseUrl}/${section._id}`, section).pipe(
      catchError(this.handleServiceSectionErrors<SectionApp>(`updateSection id=${section._id}`))
    );
  };

  removeSection(sectionId: string): Observable<SectionApp> {
    return this._http.delete<SectionApp>(`${this.sectionBaseUrl}/${sectionId}`).pipe(
      catchError(this.handleServiceSectionErrors<SectionApp>(`removeSection id=${sectionId}`))
    );
  };

  private handleServiceSectionErrors<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  };
};
