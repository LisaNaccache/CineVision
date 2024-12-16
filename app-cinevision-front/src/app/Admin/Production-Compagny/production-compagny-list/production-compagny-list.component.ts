import {Component} from '@angular/core';
import {ProductionCompagnyService} from '../production-compagny.service';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-production-compagny-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './production-compagny-list.component.html',
  styleUrl: './production-compagny-list.component.css'
})
export class ProductionCompagnyListComponent {
  companies: any[] = [];
  paginatedCompanies: any[] = [];
  isLoading = true;
  hasError = false;

  // Pagination variables
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private productionCompanyService: ProductionCompagnyService) {
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.productionCompanyService.getAllCompanies().subscribe(
      (data: any[]) => {
        this.companies = data.map((companyArray) => ({
          id_company: companyArray.id_company,
          name_company: companyArray.name_company,
        }));
        this.updatePaginatedCompanies();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading companies:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  updatePaginatedCompanies(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCompanies = this.companies.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedCompanies();
  }

  get totalPages(): number {
    return Math.ceil(this.companies.length / this.itemsPerPage);
  }
}
