import {Routes} from '@angular/router';
import {InscriptionComponent} from './inscription/inscription.component';
import {FilmEditComponent} from './Admin/Film/film-edit/film-edit.component';
import {FilmAddComponent} from './Admin/Film/film-add/film-add.component';
import {ConnectionComponent} from './connection/connection.component';
import {FilmListComponent} from './Admin/Film/film-list/film-list.component';
import {ActeurListComponent} from './Admin/Acteur/acteur-list/acteur-list.component';
import {ActeurEditComponent} from './Admin/Acteur/acteur-edit/acteur-edit.component';
import {ActeurAddComponent} from './Admin/Acteur/acteur-add/acteur-add.component';
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

export const routes: Routes = [
  { path: 'inscription', component: InscriptionComponent },
  { path: 'connection', component: ConnectionComponent },
  { path: 'admin/film/add', component: FilmAddComponent },
  { path: 'admin/film/edit/:id', component: FilmEditComponent }, // Correction ici
  { path: 'admin/film', component: FilmListComponent },
  { path: 'client/film', component: FilmComponent },
  { path: 'admin/acteur/add', component: ActeurAddComponent },
  { path: 'admin/acteur/edit/:id', component: ActeurEditComponent }, // Correction ici
  { path: 'admin/acteur', component: ActeurListComponent },
  { path: 'admin/categorie/add', component: CategorieAddComponent },
  { path: 'admin/categorie/edit/:id', component: CategorieEditComponent }, // Correction ici
  { path: 'admin/categorie', component: CategorieListComponent },
  { path: 'admin/cinema/add', component: CinemaAddComponent },
  { path: 'admin/cinema/edit/:id', component: CinemaEditComponent }, // Correction ici
  { path: 'admin/cinema', component: CinemaListComponent },
  { path: 'admin/review', component: ReviewListComponent },
  { path: 'admin/session-film/add', component: SessionFilmAddComponent },
  { path: 'admin/session-film/edit/:id', component: SessionFilmEditComponent }, // Correction ici
  { path: 'admin/session-film', component: SessionFilmListComponent },
];
