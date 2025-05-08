import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): boolean {
    if (this.authService.getCurrentUser()) {
      return true; // Autorisé si connecté
    }
    this.router.navigate(['/login']); // Redirection si non connecté
    return false;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      return true; // Autorisé si admin
    }
    this.router.navigate(['/']); // Redirection si non admin
    return false;
  }
}
