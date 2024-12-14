import {Component, OnInit} from '@angular/core';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {Film} from '../../../Models/film';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-film-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './film-list.component.html',
  styleUrl: './film-list.component.css'
})
export class FilmListComponent implements OnInit {

  //films: Film[] = [];
  films = [
    {
      id: 1,
      title: 'The Shawshank Redemption',
      popularity: 9.7,
      releaseDate: new Date('1994-09-23'),
      voteCount: 10000,
      voteAverage: 9.3
    },
    {
      id: 2,
      title: 'The Godfather',
      popularity: 9.5,
      releaseDate: new Date('1972-03-24'),
      voteCount: 9500,
      voteAverage: 9.2
    },
    {
      id: 3,
      title: 'The Dark Knight',
      popularity: 9.8,
      releaseDate: new Date('2008-07-18'),
      voteCount: 12000,
      voteAverage: 9.0
    },
    {
      id: 4,
      title: 'Pulp Fiction',
      popularity: 8.9,
      releaseDate: new Date('1994-10-14'),
      voteCount: 8500,
      voteAverage: 8.9
    },
    {
      id: 5,
      title: 'Forrest Gump',
      popularity: 8.8,
      releaseDate: new Date('1994-07-06'),
      voteCount: 8000,
      voteAverage: 8.8
    }
  ];

  constructor() {
  }

  ngOnInit(): void {


    //console.log(this.films);
  }
}
