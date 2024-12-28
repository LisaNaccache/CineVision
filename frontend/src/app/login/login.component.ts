import { Component } from '@angular/core';
import {AuthService} from './auth.service';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  login() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password);
    } else {
      alert('Please fill in all fields.');
    }
  }
}

