import {Component, OnInit} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {Film} from '../../../Models/film';

@Component({
  selector: 'app-film-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf
  ],
  templateUrl: './film-list.component.html',
  styleUrl: './film-list.component.css'
})
export class FilmListComponent implements OnInit {

  films: Film[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.films = [
      {
        id: 1,
        titre: "Inception",
        synopsis: "Un voleur expérimenté manipule les rêves pour accomplir des missions impossibles.",
        photo: "https://via.placeholder.com/150",
        bandeAnnonce: "https://www.youtube.com/watch?v=YoHD9XEInc0",
        anneeProduction: 2010,
        auteur: "Christopher Nolan"
      },
      {
        id: 2,
        titre: "The Matrix",
        synopsis: "Un programmeur découvre un monde caché qui contrôle la réalité.",
        photo: "https://via.placeholder.com/150",
        bandeAnnonce: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
        anneeProduction: 1999,
        auteur: "Lana Wachowski, Lilly Wachowski"
      },
      {
        id: 3,
        titre: "Interstellar",
        synopsis: "Des astronautes explorent un trou de ver pour sauver l'humanité.",
        photo: "https://via.placeholder.com/150",
        bandeAnnonce: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
        anneeProduction: 2014,
        auteur: "Christopher Nolan"
      }
    ];

    console.log(this.films);
  }
}
