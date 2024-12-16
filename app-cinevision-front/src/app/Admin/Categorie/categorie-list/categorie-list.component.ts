import { Component, OnInit } from '@angular/core';
import { CategorieService } from '../categorie.service';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-categorie-list',
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
export class CategorieListComponent implements OnInit {
  genres: any[] = [];
  paginatedGenres: any[] = []; // Genres affichés dans la page courante
  isLoading = true;
  hasError = false;

  // Pagination variables
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private categorieService: CategorieService) {}

  ngOnInit(): void {
    this.loadFilms();
  }

  loadFilms(): void {
    this.categorieService.getAllGenres().subscribe(
      (data: any[]) => {
        this.genres = data.map((genreArray) => ({
          id_genre: genreArray[0],
          name_genre: genreArray[1],
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

  get totalPages(): number {
    return Math.ceil(this.genres.length / this.itemsPerPage);
  }
}
