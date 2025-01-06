import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';

// Déclare un type explicite pour l'objet `data`
type DataMap = { [key: string]: string[] };

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  imports: [
    NgForOf,
    RouterLink
  ],
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  selectedItem: string | null = null;
  subFunctions: string[] = [];

  // Données codées en dur avec un type explicite
  data: DataMap = {
    'Bague': ['Bague simple', 'Bague entre les doigts'],
    'Bracelet': ['Bracelet souple', 'Bracelet rigide', 'Bracelet ouvert', 'Manchette'],
    'Sautoir': ['Sautoir', 'Sautoir (option 2)'],
    'Collier': ['Collier'],
    'Pendentif': ['Pendentif', 'Pendentif (option 2)'],
    'MO': ['MO Raquette', 'MO Puce'],
    'Clip': ['Clip'],
    'Clip Pendentif': ['Clip Pendentif'],
    'Chaîne': ['Chaîne'],
    'Bouton de manchette': ['Bouton de manchette'],
    'Montre': ['Montre'],
    'Alliance': ['Alliance'],
    'Solitaire': ['Solitaire répétitif'],
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedItem = params.get('item');
      console.log('Selected Item:', this.selectedItem); // Debug log
      this.subFunctions = this.selectedItem
        ? this.data[this.selectedItem.charAt(0).toUpperCase() + this.selectedItem.slice(1)] || []
        : [];
      console.log('SubFunctions:', this.subFunctions); // Debug log
    });
  }

  getImagePath(subFunction: string): string {
    // Remplace les espaces par des tirets et met tout en minuscule
    return `${subFunction.replace(/\s+/g, '-').toLowerCase()}.png`;
  }

  navigateToCreation(subFunction: string): void {
    console.log('Navigating to creation with:', subFunction); // Debug log
    this.router.navigate(['/creation'], { queryParams: { jewelry: subFunction } });
  }




}
