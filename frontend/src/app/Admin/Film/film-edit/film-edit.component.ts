import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FilmService} from '../film.service';

@Component({
  selector: 'app-film-edit',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './film-edit.component.html',
  styleUrl: './film-edit.component.css'
})
export class FilmEditComponent implements OnInit {
  film: any = null;
  isLoading = true;
  hasError = false;

  constructor(
    private filmService: FilmService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const filmId = Number(this.route.snapshot.paramMap.get('id'));
    if (filmId) {
      this.loadFilm(filmId);
    }
  }

  loadFilm(id: number): void {
    this.filmService.getFilmById(id).subscribe(
      (data) => {
        console.log(data);
        this.film = {
          id: data[0],
          title: data[1],
          language: data[2],
          overview: data[3],
          popularity: data[4],
          releaseDate: data[5],
          runtime: data[6],
          status: data[7],
          voteCount: data[8],
          voteAverage: data[9],
          posterUrl: data[10],
          trailerUrl: data[11],
        };
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading film:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  onFormSubmit(): void {
    const formatDate = (date: Date | string): string => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const updatedFilm = {
      id_film: this.film.id,
      title: this.film.title,
      original_language: this.film.language || null,
      overview: this.film.overview || null,
      popularity: this.film.popularity || null,
      release_date: formatDate(this.film.releaseDate),
      runtime: this.film.runtime || null,
      status: this.film.status || null,
      vote_count: this.film.voteCount || null,
      vote_average: this.film.voteAverage || null,
      link_poster: this.film.posterUrl || null,
      link_trailer: this.film.trailerUrl || null,
    };

    this.filmService.updateFilm(updatedFilm).subscribe(
      (response) => {
        alert('Film updated successfully!');
        console.log('Updated film:', response);
        this.router.navigate(['/admin/film']);
      },
      (error) => {
        console.error('Error updating film:', error);
        alert('An error occurred while updating the film.');
      }
    );
  }


  onDelete(): void {
    if (!this.film || !this.film.id) {
      alert('Film ID is required to delete the film.');
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete the film "${this.film.title}"?`);
    if (confirmDelete) {
      this.filmService.deleteFilm(this.film.id).subscribe(
        (response) => {
          alert('Film deleted successfully!');
          console.log('Deleted film:', response);
          this.router.navigate(['/admin/film']);
        },
        (error) => {
          console.error('Error deleting film:', error);
          alert('An error occurred while deleting the film.');
        }
      );
    }
  }

  back() {
    this.router.navigate(['/admin/film']);
  }
}
