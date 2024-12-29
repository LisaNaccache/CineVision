import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../../login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FilmService {

  private apiUrl = 'http://127.0.0.1:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getAllFilms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/films`);
  }

  getAllFilmsGenres(): Observable<any> {
    return this.http.get(`${this.apiUrl}/film-genres`);
  }

  getFilmById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/films/${id}`);
  }

  updateFilm(film: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/films`, film, { headers });
  }

  deleteFilm(id: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/films/${id}`, { headers });
  }

  addFilm(newFilm: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/films`, newFilm, { headers });
  }

  getFilmsByGenre(genreName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/films/genre/${genreName}`);
  }

  getFilmsByTitle(title: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/films/title/${title}`);
  }
}
