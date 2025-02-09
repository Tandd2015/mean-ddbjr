import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PostGoogle, PostApp } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly postBaseUrl = '/api/home/posts';
  constructor(private readonly _http: HttpClient) { };

  // Double Check if this function works properly
  getGooglePosts(): Observable<PostGoogle[]> {
    return this._http.get<PostGoogle[]>(`${this.postBaseUrl}/all`).pipe(
      catchError(this.handleServicePostErrors<PostGoogle[]>('getGooglePosts', []))
    );
  };

  getSitePosts(): Observable<PostApp[]> {
    return this._http.get<PostApp[]>(`${this.postBaseUrl}/site-only`).pipe(
      catchError(this.handleServicePostErrors<PostApp[]>('getSitePosts', []))
    );
  };


  createPost(post: any, files: any): Observable<any> {
    console.log('service.............Post =  ', post, files);
    const updatePostAppFormEnd: FormData = new FormData();
    updatePostAppFormEnd.append('content', post.content);
    updatePostAppFormEnd.append('category', post.category);
    updatePostAppFormEnd.append('mainImage', files[0] === undefined ? '' : files[0]);
    updatePostAppFormEnd.append('mainImageO', files[0] === undefined ? post.mainImageO : '');
    if (files[1].length > 0) {
      files[1].forEach((file: File, i: number) => {
        updatePostAppFormEnd.append('images', files[1][i]);
      })
    } else {
      updatePostAppFormEnd.append('images', '');
    }
    if (files[2].length > 0) {
      files[2].forEach((file: File, j: number) => {
        updatePostAppFormEnd.append('videos', files[2][j]);
      })
    } else {
      updatePostAppFormEnd.append('videos', '');
    }
    const header: HttpHeaders = new HttpHeaders();
    const params: HttpParams = new HttpParams();
    const options = {
      params,
      reportProgress: false,
      headers: header
    };
    const request = new HttpRequest('POST', `${this.postBaseUrl}`, updatePostAppFormEnd, options);
    return this._http.request<any>(request).pipe(
      catchError(this.handleServicePostErrors<any>(`updatePost id=${post._id}`))
    );
  };

  getPost(postId: string): Observable<PostApp> {
    return this._http.get<PostApp>(`${this.postBaseUrl}/single/${postId}`).pipe(
      catchError(this.handleServicePostErrors<PostApp>(`getPost id=${postId}`))
    );
  };

  updatePost(post: any, files: any): Observable<any> {
    const updatePostAppFormEnd: FormData = new FormData();
    updatePostAppFormEnd.append('content', post.content);
    updatePostAppFormEnd.append('category', post.category);
    updatePostAppFormEnd.append('writtenBy', post.writtenBy);
    updatePostAppFormEnd.append('likes', post.likes);
    updatePostAppFormEnd.append('newObject', post.newObject);
    updatePostAppFormEnd.append('mainImage', files[0] === undefined ? '' : files[0]);
    if (files[1].length > 0) {
      files[1].forEach((file: File, i: number) => {
        updatePostAppFormEnd.append('images', files[1][i]);
      })
    } else {
      updatePostAppFormEnd.append('images', '');
    }
    if (files[2].length > 0) {
      files[2].forEach((file: File, j: number) => {
        updatePostAppFormEnd.append('videos', files[2][j]);
      })
    } else {
      updatePostAppFormEnd.append('videos', '');
    }
    const header: HttpHeaders = new HttpHeaders();
    const params: HttpParams = new HttpParams();
    const options = {
      params,
      reportProgress: false,
      headers: header
    };
    const request = new HttpRequest('PUT', `${this.postBaseUrl}/${post._id}`, updatePostAppFormEnd, options);
    return this._http.request<any>(request).pipe(
      catchError(this.handleServicePostErrors<any>(`updatePost id=${post._id}`))
    );
  };

  removePost(postId: string): Observable<PostApp> {
    return this._http.delete<PostApp>(`${this.postBaseUrl}/${postId}`).pipe(
      catchError(this.handleServicePostErrors<PostApp>(`removePost id=${postId}`))
    );
  };

  private handleServicePostErrors<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  };
};
