import {Routes} from '@angular/router';
import {InscriptionComponent} from './inscription/inscription.component';
import {FilmEditComponent} from './Admin/Film/film-edit/film-edit.component';
import {FilmAddComponent} from './Admin/Film/film-add/film-add.component';
import {ConnectionComponent} from './connection/connection.component';
import {FilmListComponent} from './Admin/Film/film-list/film-list.component';
import {CategorieAddComponent} from './Admin/Categorie/categorie-add/categorie-add.component';
import {CategorieEditComponent} from './Admin/Categorie/categorie-edit/categorie-edit.component';
import {CategorieListComponent} from './Admin/Categorie/categorie-list/categorie-list.component';
import {CinemaAddComponent} from './Admin/Cinema/cinema-add/cinema-add.component';
import {CinemaEditComponent} from './Admin/Cinema/cinema-edit/cinema-edit.component';
import {CinemaListComponent} from './Admin/Cinema/cinema-list/cinema-list.component';
import {SessionFilmAddComponent} from './Admin/SessionFilm/session-film-add/session-film-add.component';
import {SessionFilmEditComponent} from './Admin/SessionFilm/session-film-edit/session-film-edit.component';
import {SessionFilmListComponent} from './Admin/SessionFilm/session-film-list/session-film-list.component';
import {ReviewListComponent} from './Admin/Review/review-list/review-list.component';
import {FilmComponent} from './film/film.component';
import {FilmDetailComponent} from './Admin/Film/film-detail/film-detail.component';

export const routes: Routes = [
  { path: 'inscription', component: InscriptionComponent },
  { path: 'connection', component: ConnectionComponent },
  { path: 'admin/film/add', component: FilmAddComponent },
  { path: 'admin/film/edit/:id', component: FilmEditComponent },
  { path: 'admin/film', component: FilmListComponent },
  { path: '', component: FilmComponent },
  { path: 'client/film', component: FilmComponent },
  { path: 'client/film/:id', component: FilmDetailComponent },
  { path: 'admin/categorie/add', component: CategorieAddComponent },
  { path: 'admin/categorie/edit/:id', component: CategorieEditComponent },
  { path: 'admin/categorie', component: CategorieListComponent },
  { path: 'admin/cinema/add', component: CinemaAddComponent },
  { path: 'admin/cinema/edit/:id', component: CinemaEditComponent },
  { path: 'admin/cinema', component: CinemaListComponent },
  { path: 'admin/review', component: ReviewListComponent },
  { path: 'admin/session-film/add', component: SessionFilmAddComponent },
  { path: 'admin/session-film/edit/:id', component: SessionFilmEditComponent },
  { path: 'admin/session-film', component: SessionFilmListComponent },
];
