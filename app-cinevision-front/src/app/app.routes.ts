import {Routes} from '@angular/router';
import {InscriptionComponent} from './inscription/inscription.component';
import {FilmEditComponent} from './Admin/Film/film-edit/film-edit.component';
import {FilmAddComponent} from './Admin/Film/film-add/film-add.component';
import {ConnectionComponent} from './connection/connection.component';
import {FilmListComponent} from './Admin/Film/film-list/film-list.component';

export const routes: Routes = [
  {path: 'inscription', component: InscriptionComponent},
  {path: 'connection', component: ConnectionComponent},
  {path: 'admin/film/add', component: FilmAddComponent},
  {path: 'admin/film/edit:id', component: FilmEditComponent},
  {path: 'admin/film', component: FilmListComponent},
];
