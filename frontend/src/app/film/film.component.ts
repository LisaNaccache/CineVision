import {Component} from '@angular/core';
import {FilmService} from '../Admin/Film/film.service';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {GenreService} from '../Admin/Genre/genre.service';

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

  genres: any[] = [];

  searchTerm: string = '';
  selectedGenre: string = '';

  constructor(private filmService: FilmService, private genreService: GenreService) {
  }

  ngOnInit(): void {
    this.loadFilms();
    this.loadGenres();
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

}
