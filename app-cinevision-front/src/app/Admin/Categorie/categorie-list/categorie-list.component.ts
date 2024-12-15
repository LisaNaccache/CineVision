import { Component, OnInit } from '@angular/core';
import { CategorieService } from '../categorie.service';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-genre-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './categorie-list.component.html',
  styleUrls: ['./categorie-list.component.css'],
})
export class GenreListComponent implements OnInit {
  genres: any[] = [];
  paginatedGenres: any[] = []; // Genres affichés dans la page courante
  isLoading = true;
  hasError = false;

  // Pagination variables
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private filmService: CategorieService) {}

  ngOnInit(): void {
    this.loadFilms();
  }

  loadFilms(): void {
    this.filmService.getAllGenres().subscribe(
      (data: any[]) => {
        this.genres = data.map((genreArray) => ({
          id: genreArray[0],
          name: genreArray[1],
        }));
        this.updatePaginatedGenres();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading genres:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  // Mettre à jour les genres affichés en fonction de la page courante
  updatePaginatedGenres(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedGenres = this.genres.slice(startIndex, endIndex);
  }

  // Changer de page
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedGenres();
  }

  // Nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.genres.length / this.itemsPerPage);
  }
}
