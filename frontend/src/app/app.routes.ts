import {Routes} from '@angular/router';
import {InscriptionComponent} from './inscription/inscription.component';
import {FilmEditComponent} from './Admin/Film/film-edit/film-edit.component';
import {FilmAddComponent} from './Admin/Film/film-add/film-add.component';
import {ConnectionComponent} from './connection/connection.component';
import {FilmListComponent} from './Admin/Film/film-list/film-list.component';
import {GenreAddComponent} from './Admin/Genre/genre-add/genre-add.component';
import {GenreEditComponent} from './Admin/Genre/genre-edit/genre-edit.component';
import {GenreListComponent} from './Admin/Genre/genre-list/genre-list.component';
import {CinemaAddComponent} from './Admin/Cinema/cinema-add/cinema-add.component';
import {CinemaEditComponent} from './Admin/Cinema/cinema-edit/cinema-edit.component';
import {CinemaListComponent} from './Admin/Cinema/cinema-list/cinema-list.component';
import {SessionFilmAddComponent} from './Admin/SessionFilm/session-film-add/session-film-add.component';
import {SessionFilmEditComponent} from './Admin/SessionFilm/session-film-edit/session-film-edit.component';
import {SessionFilmListComponent} from './Admin/SessionFilm/session-film-list/session-film-list.component';
import {ReviewListComponent} from './Admin/Review/review-list/review-list.component';
import {FilmComponent} from './film/film.component';
import {FilmDetailComponent} from './Admin/Film/film-detail/film-detail.component';
import {
  ProductionCompagnyAddComponent
} from './Admin/Production-Compagny/production-compagny-add/production-compagny-add.component';
import {
  ProductionCompagnyEditComponent
} from './Admin/Production-Compagny/production-compagny-edit/production-compagny-edit.component';
import {
  ProductionCompagnyListComponent
} from './Admin/Production-Compagny/production-compagny-list/production-compagny-list.component';
import {
  ProductionCountryAddComponent
} from './Admin/Production-Country/production-country-add/production-country-add.component';
import {
  ProductionCountryEditComponent
} from './Admin/Production-Country/production-country-edit/production-country-edit.component';
import {
  ProductionCountryListComponent
} from './Admin/Production-Country/production-country-list/production-country-list.component';

export const routes: Routes = [
  { path: 'inscription', component: InscriptionComponent },
  { path: 'connection', component: ConnectionComponent },
  { path: 'admin/film/add', component: FilmAddComponent },
  { path: 'admin/film/edit/:id', component: FilmEditComponent },
  { path: 'admin/film', component: FilmListComponent },
  { path: '', component: FilmComponent },
  { path: 'client/film', component: FilmComponent },
  { path: 'client/film/:id', component: FilmDetailComponent },
  { path: 'admin/genre/add', component: GenreAddComponent },
  { path: 'admin/genre/edit/:id', component: GenreEditComponent },
  { path: 'admin/genre', component: GenreListComponent },
  { path: 'admin/production-compagny/add', component: ProductionCompagnyAddComponent },
  { path: 'admin/production-compagny/edit/:id', component: ProductionCompagnyEditComponent },
  { path: 'admin/production-compagny', component: ProductionCompagnyListComponent },
  { path: 'admin/production-country/add', component: ProductionCountryAddComponent },
  { path: 'admin/production-country/edit/:id', component: ProductionCountryEditComponent },
  { path: 'admin/production-country', component: ProductionCountryListComponent },
  { path: 'admin/cinema/add', component: CinemaAddComponent },
  { path: 'admin/cinema/edit/:id', component: CinemaEditComponent },
  { path: 'admin/cinema', component: CinemaListComponent },
  { path: 'admin/review', component: ReviewListComponent },
  { path: 'admin/session-film/add', component: SessionFilmAddComponent },
  { path: 'admin/session-film/edit/:id', component: SessionFilmEditComponent },
  { path: 'admin/session-film', component: SessionFilmListComponent },
];
