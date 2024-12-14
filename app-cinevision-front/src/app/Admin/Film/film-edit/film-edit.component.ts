import {Component} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

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
export class FilmEditComponent {
  film: any = null; // Initialisez le modèle du film ici

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    // Récupérez l'ID du film à partir de la route
    const filmId = this.route.snapshot.paramMap.get('id');
    if (filmId) {
      this.loadFilm(Number(filmId));
    }
  }

  // Charger un film par ID (mocké ici, à remplacer par un appel au backend)
  loadFilm(id: number): void {
    const mockFilms = [
      {
        id: 1,
        title: 'The Shawshank Redemption',
        popularity: 9.7,
        releaseDate: '1994-09-23',
        voteCount: 10000,
        voteAverage: 9.3
      },
      {id: 2, title: 'The Godfather', popularity: 9.5, releaseDate: '1972-03-24', voteCount: 9500, voteAverage: 9.2},
      {id: 3, title: 'The Dark Knight', popularity: 9.8, releaseDate: '2008-07-18', voteCount: 12000, voteAverage: 9.0}
    ];
    this.film = mockFilms.find(film => film.id === id) || null;
  }

  // Soumission du formulaire
  onFormSubmit(): void {
    console.log('Film modifié :', this.film);
    alert('Film enregistré avec succès !');
    this.router.navigate(['/admin/film']);
  }

  // Suppression du film
  onDelete(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      console.log('Film supprimé :', this.film.id);
      alert('Film supprimé avec succès !');
      this.router.navigate(['/admin/film']);
    }
  }
}
