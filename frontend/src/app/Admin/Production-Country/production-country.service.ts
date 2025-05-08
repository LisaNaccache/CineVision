import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../login/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductionCountryService {
  private apiUrl = 'http://127.0.0.1:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllCountries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/production-countries`);
  }

  getCountryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/production-countries/${id}`);
  }

  addCountry(country: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/production-countries`, country, { headers });
  }

  updateCountry(country: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/production-countries`, country, { headers });
  }

  deleteCountry(id: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/production-countries/${id}`, { headers });
  }
}
