import { Component } from '@angular/core';
import {AuthService} from '../login/auth.service';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-registrer',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './registrer.component.html',
  styleUrl: './registrer.component.css'
})
export class RegistrerComponent {
  email = '';
  password = '';
  first_name = '';
  last_name = '';
  age: number | null = null;

  constructor(private authService: AuthService) {}

  register() {
    if (this.email && this.password && this.first_name && this.last_name) {
      const user = {
        email: this.email,
        password: this.password,
        first_name: this.first_name,
        last_name: this.last_name,
        age: this.age,
      };
      this.authService.register(user);
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
