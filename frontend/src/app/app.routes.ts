import {Routes} from '@angular/router';
import {FilmEditComponent} from './Admin/Film/film-edit/film-edit.component';
import {FilmAddComponent} from './Admin/Film/film-add/film-add.component';
import {FilmListComponent} from './Admin/Film/film-list/film-list.component';
import {GenreAddComponent} from './Admin/Genre/genre-add/genre-add.component';
import {GenreEditComponent} from './Admin/Genre/genre-edit/genre-edit.component';
import {GenreListComponent} from './Admin/Genre/genre-list/genre-list.component';
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
import {LoginComponent} from './login/login.component';
import {AdminGuard} from './guards/auth.guard';
import {AuthGuard} from './guards/auth.guard';
import {RegistrerComponent} from './registrer/registrer.component';

export const routes: Routes = [
  {path: 'register', component: RegistrerComponent},
  {path: 'login', component: LoginComponent},
  {path: 'film', component: FilmComponent},
  {path: 'film/:id', component: FilmDetailComponent},
  {path: '', component: FilmComponent},

  // Admin Routes
  {path: 'admin/film/add', component: FilmAddComponent, canActivate: [AdminGuard]},
  {path: 'admin/film/edit/:id', component: FilmEditComponent, canActivate: [AdminGuard]},
  {path: 'admin/film', component: FilmListComponent, canActivate: [AdminGuard]},
  {path: 'admin/genre/add', component: GenreAddComponent, canActivate: [AdminGuard]},
  {path: 'admin/genre/edit/:id', component: GenreEditComponent, canActivate: [AdminGuard]},
  {path: 'admin/genre', component: GenreListComponent, canActivate: [AdminGuard]},
  {path: 'admin/production-compagny/add', component: ProductionCompagnyAddComponent, canActivate: [AdminGuard]},
  {path: 'admin/production-compagny/edit/:id', component: ProductionCompagnyEditComponent, canActivate: [AdminGuard]},
  {path: 'admin/production-compagny', component: ProductionCompagnyListComponent, canActivate: [AdminGuard]},
  {path: 'admin/production-country/add', component: ProductionCountryAddComponent, canActivate: [AdminGuard]},
  {path: 'admin/production-country/edit/:id', component: ProductionCountryEditComponent, canActivate: [AdminGuard]},
  {path: 'admin/production-country', component: ProductionCountryListComponent, canActivate: [AdminGuard]},
];
