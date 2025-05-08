import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ProductionCountryService} from '../production-country.service';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-production-country-add',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './production-country-add.component.html',
  styleUrl: './production-country-add.component.css'
})
export class ProductionCountryAddComponent {

  country: any = {
    id_country: '',
    name_country: '',
  };

  isLoading = false;
  hasError = false;

  constructor(private productionCountryService: ProductionCountryService, private router: Router) {
  }

  onFormSubmit(): void {
    this.isLoading = true;

    const newCountry = {
      id_country: this.country.id_country,
      name_country: this.country.name_country,
    };

    this.productionCountryService.addCountry(newCountry).subscribe(
      (response) => {
        alert('Production country added successfully!');
        this.router.navigate(['/admin/production-country']);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error adding country:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  back() {
    this.router.navigate(['/admin/production-country']);
  }
}
