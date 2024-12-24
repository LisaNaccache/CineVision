import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ProductionCountryService} from '../production-country.service';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-production-country-edit',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './production-country-edit.component.html',
  styleUrl: './production-country-edit.component.css'
})
export class ProductionCountryEditComponent {
  country: any = null;
  isLoading = true;
  hasError = false;

  constructor(
    private productionCountryService: ProductionCountryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const countryId = Number(this.route.snapshot.paramMap.get('id'));
    if (countryId) {
      this.loadCountry(countryId);
    }
  }

  loadCountry(id: number): void {
    this.productionCountryService.getCountryById(id).subscribe(
      (data) => {
        this.country = {
          id_country: data[0],
          name_country: data[1],
        };
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading country:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  onFormSubmit(): void {
    const updatedCountry = {
      id_country: this.country.id_country,
      name_country: this.country.name_country,
    };

    this.productionCountryService.updateCountry(updatedCountry).subscribe(
      (response) => {
        alert('Country updated successfully!');
        console.log('Updated country:', response);
        this.router.navigate(['/admin/production-country']);
      },
      (error) => {
        console.error('Error updating country:', error);
        alert('An error occurred while updating the country.');
      }
    );
  }


  onDelete(): void {
    if (!this.country || !this.country.id_country) {
      alert('Country ID is required to delete the country.');
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete the country "${this.country.name_country}"?`);
    if (confirmDelete) {
      this.productionCountryService.deleteCountry(this.country.id_country).subscribe(
        (response) => {
          alert('Production country deleted successfully!');
          console.log('Deleted production country:', response);
          this.router.navigate(['/admin/production-country']);
        },
        (error) => {
          console.error('Error deleting production country:', error);
          alert('An error occurred while deleting the production country.');
        }
      );
    }
  }

  back() {
    this.router.navigate(['/admin/production-country']);
  }
}
