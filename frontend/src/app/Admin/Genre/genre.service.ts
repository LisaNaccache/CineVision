import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../../login/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private apiUrl = 'http://127.0.0.1:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getAllGenres(): Observable<any> {
    return this.http.get(`${this.apiUrl}/genres`);
  }

  getGenreById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/genres/${id}`);
  }

  updateGenre(genre: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/genres`, genre, {headers});
  }

  deleteGenre(id: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/genres/${id}`, {headers});
  }

  addGenre(newGenre: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/genres`, newGenre, {headers});
  }
}
