import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => {
      const queryParams = new URLSearchParams(window.location.search);
      const sessionID = queryParams.get('sessionID');
      const objectID = queryParams.get('objectID');

      if (sessionID && objectID) {
        return `/mbom?sessionID=${sessionID}&objectID=${objectID}`;
      }

      return '/home';
    },
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'creation',
    loadComponent: () => import('./creation/creation.component').then(m => m.CreationComponent),
  },
  {
    path: 'selection',
    loadComponent: () => import('./selection-page/selection-page.component').then(m => m.SelectionPageComponent),
  },
  {
    path: 'mbom',
    loadComponent: () => import('./mbom-page/mbom-page.component').then(m => m.MBOMPageComponent),
  },
  {
    path: ':item',
    component: DetailsComponent,
  },
];
