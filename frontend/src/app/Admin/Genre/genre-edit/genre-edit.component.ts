import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {GenreService} from '../genre.service';

@Component({
  selector: 'app-genre-edit',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './genre-edit.component.html',
  styleUrl: './genre-edit.component.css'
})
export class GenreEditComponent implements OnInit {
  genre: any = null;
  isLoading = true;
  hasError = false;

  constructor(
    private genreService: GenreService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const genreId = Number(this.route.snapshot.paramMap.get('id'));
    if (genreId) {
      this.loadGenre(genreId);
    }
  }

  loadGenre(id: number): void {
    this.genreService.getGenreById(id).subscribe(
      (data) => {
        this.genre = {
          id_genre: data[0],
          name_genre: data[1],
        };
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading genre:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  onFormSubmit(): void {
    const updatedGenre = {
      id_genre: this.genre.id_genre,
      name_genre: this.genre.name_genre,
    };

    this.genreService.updateGenre(updatedGenre).subscribe(
      (response) => {
        alert('Genre updated successfully!');
        console.log('Updated genre:', response);
        this.router.navigate(['/admin/genre']);
      },
      (error) => {
        console.error('Error updating genre:', error);
        alert('An error occurred while updating the genre.');
      }
    );
  }


  onDelete(): void {
    if (!this.genre || !this.genre.id_genre) {
      alert('Genre ID is required to delete the film.');
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete the genre "${this.genre.name_genre}"?`);
    if (confirmDelete) {
      this.genreService.deleteGenre(this.genre.id_genre).subscribe(
        (response) => {
          alert('Genre deleted successfully!');
          console.log('Deleted genre:', response);
          this.router.navigate(['/admin/genre']);
        },
        (error) => {
          console.error('Error deleting genre:', error);
          alert('An error occurred while deleting the genre.');
        }
      );
    }
  }

  back() {
    this.router.navigate(['/admin/genre']);
  }
}
