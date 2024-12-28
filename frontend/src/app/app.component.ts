import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from './login/auth.service';
import {CommonModule, NgFor, NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgFor, NgIf, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CineVision';

  isLoggedIn = false;
  isAdmin = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.is_admin || false;
    });
  }

  logout() {
    this.authService.logout();
  }
}
