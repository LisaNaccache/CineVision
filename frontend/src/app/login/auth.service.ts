import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {
    const user = this.getCurrentUser();
    if (user) {
      this.userSubject.next(user);
    }
  }

  login(email: string, password: string) {
    return this.http
      .post(`${this.apiUrl}/users/login`, { email, password })
      .subscribe({
        next: (response: any) => {
          const { token } = response;
          localStorage.setItem('jwt', token);
          const payload = this.decodeToken(token);
          this.userSubject.next(payload);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Invalid credentials.');
        },
      });
  }

  register(user: any) {
    return this.http.post(`${this.apiUrl}/users/register`, user).subscribe({
      next: () => {
        alert('Registration successful, please log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('An error occurred during registration.');
      },
    });
  }


  logout() {
    localStorage.removeItem('jwt');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getCurrentUser() {
    const token = localStorage.getItem('jwt');
    if (token) {
      return this.decodeToken(token);
    }
    return null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.is_admin : false;
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }
}
