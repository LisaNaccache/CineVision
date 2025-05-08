import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../login/auth.service'; // Gestion des autorisations

@Injectable({
  providedIn: 'root'
})
export class ProductionCompagnyService {
  private apiUrl = 'http://127.0.0.1:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}


  getAllCompanies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/production-companies`);
  }

  getCompanyById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/production-companies/${id}`);
  }


  addCompany(compagny: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/production-companies`, compagny, { headers });
  }


  updateCompany(compagny: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/production-companies`, compagny, { headers });
  }

  deleteCompany(id: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/production-companies/${id}`, { headers });
  }
}
