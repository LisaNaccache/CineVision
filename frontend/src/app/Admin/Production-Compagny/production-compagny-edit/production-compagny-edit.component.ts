import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ProductionCompagnyService} from '../production-compagny.service';

@Component({
  selector: 'app-production-compagny-edit',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './production-compagny-edit.component.html',
  styleUrl: './production-compagny-edit.component.css'
})
export class ProductionCompagnyEditComponent {
  company: any = null;
  isLoading = true;
  hasError = false;

  constructor(
    private productionCompagnyService: ProductionCompagnyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const companyId = Number(this.route.snapshot.paramMap.get('id'));
    if (companyId) {
      this.loadcompany(companyId);
    }
  }

  loadcompany(id: number): void {
    this.productionCompagnyService.getCompanyById(id).subscribe(
      (data) => {
        this.company = {
          id_company: data[0],
          name_company: data[1], // NAME
        };
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading company:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  onFormSubmit(): void {
    const updatedcompany = {
      id_company: this.company.id_company,
      name_company: this.company.name_company,
    };

    this.productionCompagnyService.updateCompany(updatedcompany).subscribe(
      (response) => {
        alert('company updated successfully!');
        console.log('Updated company:', response);
        this.router.navigate(['/admin/production-compagny']);
      },
      (error) => {
        console.error('Error updating company:', error);
        alert('An error occurred while updating the company.');
      }
    );
  }


  onDelete(): void {
    if (!this.company || !this.company.id_company) {
      alert('company ID is required to delete the film.');
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete the company "${this.company.name_company}"?`);
    if (confirmDelete) {
      this.productionCompagnyService.deleteCompany(this.company.id_company).subscribe(
        (response) => {
          alert('company deleted successfully!');
          console.log('Deleted company:', response);
          this.router.navigate(['/admin/production-compagny']); // Redirigez vers la liste des companys
        },
        (error) => {
          console.error('Error deleting company:', error);
          alert('An error occurred while deleting the company.');
        }
      );
    }
  }

  back() {
    this.router.navigate(['/admin/production-compagny']);
  }
}
