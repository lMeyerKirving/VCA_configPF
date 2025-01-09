import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/creation?jewelry=Bracelet%20ouvert',
    pathMatch: 'full' // Redirige par défaut vers la page creation
  },
  {
    path: 'home',
    component: HomeComponent // Permet d'accéder à la page Home avec /home
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
    path: ':item',
    component: DetailsComponent
  },
];
