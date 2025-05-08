import {Component} from '@angular/core';
import {GenreService} from '../genre.service';
import {Router, RouterLink} from '@angular/router';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-genre-add',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './genre-add.component.html',
  styleUrl: './genre-add.component.css'
})
export class GenreAddComponent {

  genre: any = {
    id_genre: '',
    name_genre: '',
  };

  isLoading = false;
  hasError = false;

  constructor(private genreService: GenreService, private router: Router) {
  }

  onFormSubmit(): void {
    this.isLoading = true;

    const newGenre = {
      id_genre: this.genre.id_genre,
      name_genre: this.genre.name_genre,
    };

    this.genreService.addGenre(newGenre).subscribe(
      (response) => {
        alert('Genre added successfully!');
        console.log('New genre:', response);
        this.router.navigate(['/admin/genre']);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error adding genre:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  back() {
    this.router.navigate(['/admin/genre']);
  }
}
