import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReviewApp, ReviewGoogle } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private readonly reviewBaseUrl = '/api/home/reviews';

  constructor(private readonly _http: HttpClient) { };

  getGoogleReviews(): Observable<ReviewGoogle[]> {
    return this._http.get<ReviewGoogle[]>(`${this.reviewBaseUrl}/all`).pipe(
      catchError(this.handleServiceReviewErrors<ReviewGoogle[]>('getGoogleReviews', []))
    );
  };

  getSiteReviews(): Observable<ReviewApp[]> {
    return this._http.get<ReviewApp[]>(`${this.reviewBaseUrl}/site-only`).pipe(
      catchError(this.handleServiceReviewErrors<ReviewApp[]>('getSiteReviews', []))
    );
  };

  createReview(review: ReviewApp, file: File): Observable<any> {
    const newReviewAppFormEnd: FormData = new FormData();
    newReviewAppFormEnd.append('content', review.content);
    newReviewAppFormEnd.append('writtenBy', review.writtenBy);
    newReviewAppFormEnd.append('byRating', review.byRating.toString());
    newReviewAppFormEnd.append('byImage', file);
    const header: HttpHeaders = new HttpHeaders();
    const params: HttpParams = new HttpParams();
    const options = {
      params,
      reportProgress: false,
      headers: header
    };
    const request = new HttpRequest('POST', this.reviewBaseUrl, newReviewAppFormEnd, options);
    return this._http.request<any>(request).pipe(
      catchError(this.handleServiceReviewErrors<any>(`createReview`))
    );
  };

  getReview(reviewId: string): Observable<ReviewApp> {
    return this._http.get<ReviewApp>(`${this.reviewBaseUrl}/single/${reviewId}`).pipe(
      catchError(this.handleServiceReviewErrors<ReviewApp>(`getReview id=${reviewId}`))
    );
  };

  updateReview(review: ReviewApp): Observable<ReviewApp> {
    return this._http.put<ReviewApp>(`${this.reviewBaseUrl}/${review._id}`, review).pipe(
      catchError(this.handleServiceReviewErrors<ReviewApp>(`updateReview id=${review._id}`))
    );
  };

  removeReview(reviewId: string): Observable<ReviewApp> {
    return this._http.delete<ReviewApp>(`${this.reviewBaseUrl}/${reviewId}`).pipe(
      catchError(this.handleServiceReviewErrors<ReviewApp>(`removeReview id=${reviewId}`))
    );
  };

  private handleServiceReviewErrors<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  };
};
