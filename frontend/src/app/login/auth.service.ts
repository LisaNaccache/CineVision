import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<any>(null); // Manage the current user
  user$ = this.userSubject.asObservable(); // Observable to track user changes

  private apiUrl = 'http://localhost:3000/api'; // Backend API URL

  constructor(private http: HttpClient, private router: Router) {
    const user = this.getCurrentUser();
    if (user) {
      this.userSubject.next(user);
    }
  }

  /**
   * Sends a request to log in the user.
   */
  login(email: string, password: string) {
    return this.http
      .post(`${this.apiUrl}/users/login`, {email, password})
      .subscribe({
        next: (response: any) => {
          const {token} = response;
          localStorage.setItem('jwt', token); // Store the JWT token
          const payload = this.decodeToken(token); // Decode the JWT token
          this.userSubject.next(payload); // Update the logged-in user
          this.router.navigate(['/']); // Redirect after login
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Invalid credentials.');
        },
      });
  }

  /**
   * Sends a request to register a new user.
   */
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

  /**
   * Logs out the user by removing the token.
   */
  logout() {
    localStorage.removeItem('jwt'); // Remove the JWT token
    this.userSubject.next(null); // Reset the user
    this.router.navigate(['/login']); // Redirect to the login page
  }

  /**
   * Retrieves the current user from the JWT token.
   */
  getCurrentUser() {
    const token = localStorage.getItem('jwt');
    if (token) {
      return this.decodeToken(token); // Return the decoded payload
    }
    return null;
  }

  /**
   * Checks if the current user is an administrator.
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.is_admin : false;
  }

  /**
   * Decodes a JWT token to retrieve the payload.
   */
  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }
}
