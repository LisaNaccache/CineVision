import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {CategorieService} from '../categorie.service';

@Component({
  selector: 'app-genre-edit',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './categorie-edit.component.html',
  styleUrl: './categorie-edit.component.css'
})
export class GenreEditComponent implements OnInit {
  genre: any = null; // Modèle du film
  isLoading = true;
  hasError = false;

  constructor(
    private categorieService: CategorieService,
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

  // Récupérer les données d'un film
  loadGenre(id: number): void {
    this.categorieService.getGenreById(id).subscribe(
      (data) => {
        this.genre = {
          id_name: data[0], // ID_NAME
          name: data[1], // NAME
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
    // Convertir la date au format 'YYYY-MM-DD'
    const formatDate = (date: Date | string): string => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Mois au format 2 chiffres
      const day = String(d.getDate()).padStart(2, '0'); // Jour au format 2 chiffres
      return `${year}-${month}-${day}`;
    };

    const updatedGenre = {
      id_genre: this.genre.id,
      name: this.genre.name,
    };

    this.categorieService.updateGenre(updatedGenre).subscribe(
      (response) => {
        alert('Genre updated successfully!');
        console.log('Updated genre:', response);
        this.router.navigate(['/admin/categorie']);
      },
      (error) => {
        console.error('Error updating genre:', error);
        alert('An error occurred while updating the genre.');
      }
    );
  }


  // Suppression du film
  onDelete(): void {
    if (!this.genre || !this.genre.id) {
      alert('Genre ID is required to delete the film.');
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete the genre "${this.genre.name}"?`);
    if (confirmDelete) {
      this.categorieService.deleteGenre(this.genre.id).subscribe(
        (response) => {
          alert('Genre deleted successfully!');
          console.log('Deleted genre:', response);
          this.router.navigate(['/admin/categorie']); // Redirigez vers la liste des genres
        },
        (error) => {
          console.error('Error deleting genre:', error);
          alert('An error occurred while deleting the genre.');
        }
      );
    }
  }
}
