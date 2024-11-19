import {Routes} from '@angular/router';
import {InscriptionComponent} from './inscription/inscription.component';
import {FilmComponent} from './film/film.component';
import {AdminFilmComponent} from './admin-film/admin-film.component';

export const routes: Routes = [
  {path: 'inscription', component: InscriptionComponent},
  {path: 'admin/film', component: AdminFilmComponent},
];
