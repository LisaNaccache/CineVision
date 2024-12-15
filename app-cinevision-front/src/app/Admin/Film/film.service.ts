import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilmService {

  private apiUrl = 'http://127.0.0.1:3000/api';

  constructor(private http: HttpClient) {
  }

  getAllFilms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/films`);
  }

  getFilmById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/films/${id}`);
  }

  updateFilm(film: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/films`, film);
  }

  deleteFilm(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/films/${id}`);
  }

  addFilm(newFilm: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/films`, newFilm);
  }
}