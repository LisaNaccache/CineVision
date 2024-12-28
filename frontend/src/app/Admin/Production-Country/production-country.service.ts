import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductionCountryService {

  private apiUrl = 'http://127.0.0.1:3000/api';

  constructor(private http: HttpClient) {}

  getAllCountries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/production-countries`);
  }

  getCountryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/production-countries/${id}`);
  }

  addCountry(country: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/production-countries`, country);
  }

  updateCountry(country: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/production-countries`, country);
  }

  deleteCountry(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/production-countries/${id}`);
  }
}
