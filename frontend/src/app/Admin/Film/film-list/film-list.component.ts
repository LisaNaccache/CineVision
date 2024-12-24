import { Component, OnInit } from '@angular/core';
import { FilmService } from '../film.service';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-film-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './film-list.component.html',
  styleUrls: ['./film-list.component.css'],
})
export class FilmListComponent implements OnInit {
  films: any[] = [];
  paginatedFilms: any[] = []; // Films affichés dans la page courante
  isLoading = true;
  hasError = false;

  currentPage = 1;
  itemsPerPage = 10;

  constructor(private filmService: FilmService) {}

  ngOnInit(): void {
    this.loadFilms();
  }

  loadFilms(): void {
    this.filmService.getAllFilms().subscribe(
      (data: any[]) => {
        this.films = data.map((filmArray) => ({
          id: filmArray[0],
          title: filmArray[1],
          language: filmArray[2],
          description: filmArray[3],
          popularity: filmArray[4],
          releaseDate: filmArray[5],
          runtime: filmArray[6],
          status: filmArray[7],
          voteCount: filmArray[8],
          voteAverage: filmArray[9],
          posterUrl: filmArray[10],
          trailerUrl: filmArray[11],
        }));
        this.updatePaginatedFilms();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading films:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  updatePaginatedFilms(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFilms = this.films.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedFilms();
  }

  get totalPages(): number {
    return Math.ceil(this.films.length / this.itemsPerPage);
  }
}
