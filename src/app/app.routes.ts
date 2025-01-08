import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'creation',
    loadComponent: () => import('./creation/creation.component').then(m => m.CreationComponent),
  },
  {
    path: 'selection',
    loadComponent: () => import('./selection-page/selection-page.component').then(m => m.SelectionPageComponent),
  },
  { path: ':item', component: DetailsComponent },
];


