import { Component } from '@angular/core';
import {FilmService} from '../film.service';
import {Router, RouterLink} from '@angular/router';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-film-add',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './film-add.component.html',
  styleUrl: './film-add.component.css'
})
export class FilmAddComponent {

  film: any = {
    title: '',
    language: '',
    overview: '',
    popularity: null,
    releaseDate: '',
    runtime: null,
    status: '',
    voteCount: null,
    voteAverage: null,
    posterUrl: '',
    trailerUrl: '',
  };

  isLoading = false;
  hasError = false;

  constructor(private filmService: FilmService, private router: Router) {}

  onFormSubmit(): void {
    this.isLoading = true;

    const formatDate = (date: string): string => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const newFilm = {
      title: this.film.title,
      original_language: this.film.language || null,
      overview: this.film.overview || null,
      popularity: this.film.popularity || null,
      release_date: formatDate(this.film.releaseDate), // Conversion au format attendu
      runtime: this.film.runtime || null,
      status: this.film.status || null,
      vote_count: this.film.voteCount || null,
      vote_average: this.film.voteAverage || null,
      link_poster: this.film.posterUrl || null,
      link_trailer: this.film.trailerUrl || null,
    };

    this.filmService.addFilm(newFilm).subscribe(
      (response) => {
        alert('Film added successfully!');
        console.log('New film:', response);
        this.router.navigate(['/admin/film']);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error adding film:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  back() {
    this.router.navigate(['/admin/film']);
  }
}
