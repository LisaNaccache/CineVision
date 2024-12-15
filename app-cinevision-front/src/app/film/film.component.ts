import { Component } from '@angular/core';
import {FilmService} from '../Admin/Film/film.service';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-film',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './film.component.html',
  styleUrl: './film.component.css'
})
export class FilmComponent {
  films: any[] = [];
  isLoading = true;
  hasError = false;

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
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading films:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }
}
