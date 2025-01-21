import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => {
      // Récupération des paramètres de l'URL actuelle
      const queryParams = new URLSearchParams(window.location.search);
      const sessionID = queryParams.get('sessionID');
      const objectID = queryParams.get('objectID');

      if (sessionID && objectID) {
        // Redirige vers la page creation avec les paramètres conservés
        return `/creation?jewelry=Bracelet%20ouvert&sessionID=${sessionID}&objectID=${objectID}`;
      }

      // Si les paramètres sont absents, redirige vers la page Home
      return '/home';
    }
  },
  {
    path: 'home',
    component: HomeComponent
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
    loadComponent: () => import('./mbom-page/mbom-page.component').then((m) => m.MBOMPageComponent),
  },
  { path: ':item', component: DetailsComponent },
];
