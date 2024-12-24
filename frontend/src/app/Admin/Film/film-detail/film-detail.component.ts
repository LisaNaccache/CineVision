import {Component, OnInit} from '@angular/core';
import {FilmService} from '../film.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SafeUrlPipe} from './safe-url.pipe';

@Component({
  selector: 'app-film-detail',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    SafeUrlPipe
  ],
  templateUrl: './film-detail.component.html',
  styleUrl: './film-detail.component.css'
})
export class FilmDetailComponent implements OnInit {
  film: any = null;
  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private filmService: FilmService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const filmId = Number(this.route.snapshot.paramMap.get('id'));
    if (filmId) {
      this.loadFilm(filmId);
    } else {
      this.hasError = true;
      this.isLoading = false;
    }
  }

  loadFilm(id: number): void {
    this.filmService.getFilmById(id).subscribe(
      (data) => {
        this.film = {
          id: data[0],
          title: data[1],
          description: data[3],
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
        console.error('Error loading film details:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  back() {
    this.router.navigate(['/client/film']);
  }
}
