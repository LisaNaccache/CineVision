import { Component } from '@angular/core';
import {CategorieService} from '../categorie.service';
import {Router, RouterLink} from '@angular/router';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-genre-add',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './genre-add.component.html',
  styleUrl: './genre-add.component.css'
})
export class GenreAddComponent {

  genre: any = {
    id_genre: '',
    genre: '',
  };

  isLoading = false;
  hasError = false;

  constructor(private filmService: CategorieService, private router: Router) {}

  onFormSubmit(): void {
    this.isLoading = true;

    const formatDate = (date: string): string => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Mois format 2 chiffres
      const day = String(d.getDate()).padStart(2, '0'); // Jour format 2 chiffres
      return `${year}-${month}-${day}`;
    };

    const newFilm = {
      id_genre: this.id_genre.title,
      name: this.name.language || null,
    };

    this.categorieService.addGenre(newGenre).subscribe(
      (response) => {
        alert('Genre added successfully!');
        console.log('New genre:', response);
        this.router.navigate(['/admin/categorie']); // Redirige vers la liste des films
        this.isLoading = false;
      },
      (error) => {
        console.error('Error adding genre:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }
}
