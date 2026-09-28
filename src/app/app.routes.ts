import { Routes } from '@angular/router';

import { Contact } from './components/contact/contact';
import { MainPage } from './components/main-page/main-page';
import { ListPlaces } from './components/list-places/list-places';
import { PlacePage } from './components/place-page/place-page';
import { PlaceForm } from './components/place-form/place-form';
import { UsersPanel } from './components/users-panel/users-panel';
import { Auth } from './components/auth/auth';
import { UserInfoComponent } from './components/user-info/user-info';
import { CommentsPanel } from './components/comments-panel/comments-panel';
import { LandingPage } from './components/landing-page/landing-page';
import { PlacesPanel } from './components/places-panel/places-panel';
import { NotFoundComponent } from './pages/not-found/not-found';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'contact', component: Contact, canActivate: [authGuard] },
  { path: 'listplaces', component: ListPlaces, canActivate: [authGuard] },
  { path: 'place/:id', component: PlacePage, canActivate: [authGuard] },
  { path: 'place-form', component: PlaceForm, canActivate: [authGuard] },
  { path: 'user-info/:id', component: UserInfoComponent, canActivate: [authGuard] },
  { path: 'map', component: MainPage, canActivate: [authGuard] },
  {
    path: 'users-panel',
    component: UsersPanel,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'comments-panel',
    component: CommentsPanel,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'places-panel',
    component: PlacesPanel,
    canActivate: [authGuard, adminGuard],
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];
