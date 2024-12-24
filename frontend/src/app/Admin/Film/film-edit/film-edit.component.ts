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
  film: any = null; // Modèle du film
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

  // Récupérer les données d'un film
  loadFilm(id: number): void {
    this.filmService.getFilmById(id).subscribe(
      (data) => {
        console.log(data);
        this.film = {
          id: data[0], // ID_FILM
          title: data[1], // TITLE
          language: data[2], // ORIGINAL_LANGUAGE
          overview: data[3], // OVERVIEW
          popularity: data[4], // POPULARITY
          releaseDate: data[5], // RELEASE_DATE
          runtime: data[6], // RUNTIME
          status: data[7], // STATUS
          voteCount: data[8], // VOTE_COUNT
          voteAverage: data[9], // VOTE_AVERAGE
          posterUrl: data[10], // LINK_POSTER
          trailerUrl: data[11], // LINK_TRAILER
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
    // Convertir la date au format 'YYYY-MM-DD'
    const formatDate = (date: Date | string): string => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Mois au format 2 chiffres
      const day = String(d.getDate()).padStart(2, '0'); // Jour au format 2 chiffres
      return `${year}-${month}-${day}`;
    };

    const updatedFilm = {
      id_film: this.film.id,
      title: this.film.title,
      original_language: this.film.language || null,
      overview: this.film.description || null,
      popularity: this.film.popularity || null,
      release_date: formatDate(this.film.releaseDate), // Conversion ici
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


  // Suppression du film
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
          this.router.navigate(['/admin/film']); // Redirigez vers la liste des films
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
