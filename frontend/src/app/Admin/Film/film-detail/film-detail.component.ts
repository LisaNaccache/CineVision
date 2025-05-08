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
  rating = 0;

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
          original_language: data[2],
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
        console.error('Error loading film details:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  submitRating(): void {
    if (this.rating < 1 || this.rating > 10) {
      alert('Please provide a rating between 1 and 10.');
      return;
    }

    this.filmService.rateFilm(this.film.id, this.rating).subscribe((response) => {
        alert('Thank you for your rating!');
        this.film.voteCount = response.updated.vote_count;
        this.film.voteAverage = response.updated.vote_average;
      },
      (error) => {
        console.error('Error submitting rating:', error);
        alert('An error occurred while submitting your rating.');
      }
    );
  }

  getSafeYouTubeUrl(url: string): string {
    const isValidYouTubeUrl = url.includes('youtube.com') || url.includes('youtu.be');
    return isValidYouTubeUrl ? url : '';
  }

  formatRuntime(runtime: number): string {
    if (!runtime || runtime <= 0) {
      return 'N/A';
    }

    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;

    return `${hours}h${minutes > 0 ? minutes + 'min' : ''}`;
  }

  getYear(releaseDate: string): string {

    if (!releaseDate || typeof releaseDate !== 'string') {
      return 'N/A';
    }

    const year = releaseDate.split('-')[0];
    return year && year.length === 4 ? year : 'N/A';
  }

  formatVoteAverage(voteAverage: number): string {
    if (!voteAverage || voteAverage <= 0) {
      return 'N/A';
    }

    return voteAverage.toFixed(1);
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


  setRating(star: number): void {
    this.rating = star;
  }

  back() {
    this.router.navigate(['/film']);
  }
}
