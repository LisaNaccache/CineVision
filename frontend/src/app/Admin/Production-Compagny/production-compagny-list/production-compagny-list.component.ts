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

  currentPage = 1;
  itemsPerPage = 10;

  constructor(private productionCompanyService: ProductionCompagnyService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.productionCompanyService.getAllCompanies().subscribe(
      (data: any[]) => {
        this.companies = data.map((company) => ({
          id_company: company[0],
          name_company: company[1],
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

  // Pagination Helpers
  get firstPages(): number[] {
    return Array.from({ length: Math.min(3, this.totalPages) }, (_, i) => i + 1);
  }

  get lastPages(): number[] {
    return Array.from(
      { length: Math.min(3, this.totalPages) },
      (_, i) => this.totalPages - i
    ).reverse();
  }

  get middlePages(): number[] {
    const middleStart = Math.max(4, this.currentPage - 1);
    const middleEnd = Math.min(this.totalPages - 3, this.currentPage + 1);
    return Array.from(
      { length: Math.max(0, middleEnd - middleStart + 1) },
      (_, i) => middleStart + i
    );
  }

  get showLeftDots(): boolean {
    return this.currentPage > 4;
  }

  get showRightDots(): boolean {
    return this.currentPage < this.totalPages - 3;
  }
}
