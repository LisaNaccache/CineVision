import {AfterViewInit, Component} from '@angular/core';
import {FilmService} from '../Admin/Film/film.service';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {GenreService} from '../Admin/Genre/genre.service';
import { Tooltip } from 'bootstrap';

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
export class FilmComponent implements AfterViewInit {
  films: any[] = [];
  isLoading = true;
  hasError = false;

  genres: any[] = [];

  searchTerm: string = '';
  selectedGenre: string = '';

  constructor(private filmService: FilmService, private genreService: GenreService) {
  }

  ngOnInit(): void {
    this.loadFilms();
    this.loadGenres();
  }

  ngAfterViewInit(): void {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl); // Initialise les tooltips de manière basique
    });
  }

  loadFilms(): void {
    this.filmService.getAllFilmsGenres().subscribe(
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
          genres: JSON.parse(filmArray[12])
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


  loadGenres(): void {
    this.genreService.getAllGenres().subscribe(
      (data: any[]) => {
        this.genres = data.map((genreArray) => ({
          id_genre: genreArray[0],
          name_genre: genreArray[1],
        }));
      },
      (error) => {
        console.error('Error loading genres:', error);
      }
    );
  }

  filterFilmsbyGenre(): void {
    this.isLoading = true;
    this.hasError = false;

    if (this.selectedGenre) {
      this.filmService.getFilmsByGenre(this.selectedGenre).subscribe(
        (data: any[]) => {
          this.films = this.mapFilms(data);
          this.applySearchTerm();
          this.isLoading = false;
          this.searchTerm = '';
        },
        (error) => {
          console.error('Error loading films by genre:', error);
          this.hasError = true;
          this.isLoading = false;
        }
      );
    } else {
      this.filmService.getAllFilmsGenres().subscribe(
        (data: any[]) => {
          this.films = this.mapFilms(data);
          this.applySearchTerm(); // Applique le filtre de recherche par nom
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

  private mapFilms(data: any[]): any[] {
    return data.map((filmArray) => ({
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
      genres: JSON.parse(filmArray[12] || '[]'), // Gestion des genres en JSON
    }));
  }

  applySearchTerm(): void {
    if (this.searchTerm) {
      const searchTermLowerCase = this.searchTerm.toLowerCase();
      this.films = this.films.filter((film) =>
        film.title.toLowerCase().includes(searchTermLowerCase)
      );
    }
  }

  filterFilmsbyTitle(): void {
    this.isLoading = true;
    this.hasError = false;

    if (this.searchTerm) {
      this.filmService.getFilmsByTitle(this.searchTerm).subscribe(
        (data: any[]) => {
          this.films = this.mapFilms(data);
          this.isLoading = false;
          this.selectedGenre = '';
        },
        (error) => {
          console.error('Error loading films by title:', error);
          this.hasError = true;
          this.isLoading = false;
        }
      );
    } else {
      this.loadFilms();
    }
  }

  formatRuntime(runtime: number): string {
    if (!runtime || runtime <= 0) {
      return 'N/A'; // Si aucune durée n'est disponible
    }

    const hours = Math.floor(runtime / 60); // Calcule les heures
    const minutes = runtime % 60; // Récupère les minutes restantes

    return `${hours}h${minutes > 0 ? minutes + 'min' : ''}`; // Formate la durée
  }

  getYear(releaseDate: string): string {

    if (!releaseDate || typeof releaseDate !== 'string') {
      return 'N/A'; // Si la date n'est pas définie ou n'est pas une chaîne
    }

    const year = releaseDate.split('-')[0]; // Extraire la partie avant le premier tiret
    return year && year.length === 4 ? year : 'N/A'; // Vérifie si l'année est valide
  }

  formatVoteAverage(voteAverage: number): string {
    if (!voteAverage || voteAverage <= 0) {
      return 'N/A'; // Si aucune note n'est disponible
    }

    return voteAverage.toFixed(1); // Arrondit à 1 chiffre après la virgule
  }


  formatVoteCount(voteCount: number): string {
    if (!voteCount || voteCount <= 0) {
      return '0';
    }

    return Math.round(voteCount).toString();
  }

  getPopularityCategory(popularity: number): string {
    if (popularity >= 100) return '🔥 Trending';
    if (popularity >= 25) return '👍 Popular';
    return '👎 Low Popularity';
  }

  formatPopularity(popularity: number): string {
    return popularity.toFixed(1);
  }


}
