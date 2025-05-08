import { Component } from '@angular/core';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {ProductionCompagnyService} from '../production-compagny.service';

@Component({
  selector: 'app-production-compagny-add',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './production-compagny-add.component.html',
  styleUrl: './production-compagny-add.component.css'
})
export class ProductionCompagnyAddComponent {

  company: any = {
    id_company: '',
    name_company: '',
  };

  isLoading = false;
  hasError = false;

  constructor(private productionCompagnyService: ProductionCompagnyService, private router: Router) {
  }

  onFormSubmit(): void {
    this.isLoading = true;

    const newCompany = {
      id_company: this.company.id_company,
      name_company: this.company.name_company,
    };

    this.productionCompagnyService.addCompany(newCompany).subscribe(
      (response) => {
        alert('Production compagny added successfully!');
        this.router.navigate(['/admin/production-compagny']);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error adding company:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  back() {
    this.router.navigate(['/admin/production-compagny']);
  }
}
