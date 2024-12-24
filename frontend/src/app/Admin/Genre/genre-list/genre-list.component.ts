import { Component, OnInit } from '@angular/core';
import { GenreService } from '../genre.service';
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
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.css'],
})
export class GenreListComponent implements OnInit {
  genres: any[] = [];
  paginatedGenres: any[] = []; // Genres affichés dans la page courante
  isLoading = true;
  hasError = false;

  // Pagination variables
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private genreService: GenreService) {}

  ngOnInit(): void {
    this.loadGenre();
  }

  loadGenre(): void {
    this.genreService.getAllGenres().subscribe(
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

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedGenres();
  }

  get totalPages(): number {
    return Math.ceil(this.genres.length / this.itemsPerPage);
  }
}
