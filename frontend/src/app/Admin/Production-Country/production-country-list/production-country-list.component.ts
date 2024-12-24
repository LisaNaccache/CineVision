import { Component } from '@angular/core';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ProductionCountryService} from '../production-country.service';

@Component({
  selector: 'app-production-country-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './production-country-list.component.html',
  styleUrl: './production-country-list.component.css'
})
export class ProductionCountryListComponent {

  countries: any[] = [];
  paginatedCountries: any[] = [];
  isLoading = true;
  hasError = false;

// Pagination variables
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private productionCountryService: ProductionCountryService) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.productionCountryService.getAllCountries().subscribe(
      (data: any[]) => {
        this.countries = data.map((countryArray) => ({
          id_country: countryArray[0],
          name_country: countryArray[1],
        }));
        this.updatePaginatedCountries();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading countries:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  updatePaginatedCountries(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCountries = this.countries.slice(startIndex, endIndex);
  }

// Changer de page
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedCountries();
  }

  get totalPages(): number {
    return Math.ceil(this.countries.length / this.itemsPerPage);
  }
}
