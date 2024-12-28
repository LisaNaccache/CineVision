import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductionCompagnyService {

  private apiUrl = 'http://127.0.0.1:3000/api';

  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/production-companies`);
  }

  getCompanyById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/production-companies/${id}`);
  }

  addCompany(company: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/production-companies`, company);
  }

  updateCompany(company: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/production-companies`, company);
  }

  deleteCompany(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/production-companies/${id}`);
  }
}
