import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  private apiUrl = 'http://127.0.0.1:3000/api';

  constructor(private http: HttpClient) {
  }

  getAllGenres(): Observable<any> {
    return this.http.get(`${this.apiUrl}/genres`);
  }

  getGenresById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/genres/${id}`);
  }

  updateGenre(film: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/genres`, film);
  }

  deleteGenre(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/genres/${id}`);
  }

  addGenre(newFilm: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/genres`, newFilm);
  }
}
