import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicesComponent } from '../shared/services/services.component';

@Component({
  selector: 'app-selection-page',
  templateUrl: './selection-page.component.html',
  styleUrls: ['./selection-page.component.css'],
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
  ]
})
export class SelectionPageComponent {
  data: any[] = []; // Données récupérées pour le tableau
  filteredData: any[] = []; // Données filtrées pour le tableau
  filters = {
    ref_utilisat: '',
    designation: '',
    version: '',
    revision: ''
  }; // Filtres pour les colonnes
  currentOption: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private services: ServicesComponent) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentOption = params['option']; // Récupérer l'attribut cliqué
      if (this.currentOption) {
        this.fetchData(this.currentOption);
      }
    });
  }

  fetchData(option: string): void {
    this.services.getType(option).subscribe(
      (response) => {
        if (response && response.data) {
          this.data = response.data;
          this.filteredData = [...this.data]; // Initialiser les données filtrées
        } else {
          console.error('Erreur de format de données', response);
          this.data = [];
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des données', error);
      }
    );
  }

  applyColumnSearch(): void {
    this.filteredData = this.data.filter(item => {
      return (
        (this.filters.ref_utilisat === '' || item.ref_utilisat.toLowerCase().includes(this.filters.ref_utilisat.toLowerCase())) &&
        (this.filters.designation === '' || item.designation.toLowerCase().includes(this.filters.designation.toLowerCase())) &&
        (this.filters.version === '' || item.version.toLowerCase().includes(this.filters.version.toLowerCase())) &&
        (this.filters.revision === '' || item.revision.toLowerCase().includes(this.filters.revision.toLowerCase()))
      );
    });
  }

  onSelect(item: any): void {
    const savedState = this.route.snapshot.queryParamMap.get('state'); // Récupérer l'état précédent
    const jewelry = this.route.snapshot.queryParamMap.get('jewelry'); // Récupérer le bijou sélectionné

    this.router.navigate(['/creation'], {
      queryParams: {
        jewelry, // Garder le bijou sélectionné
        option: this.currentOption, // Attribut actuel
        selectedDesignation: item.designation, // Élément sélectionné (désignation)
        selectedReference: item.ref_utilisat, // Élément sélectionné (référence)
        state: savedState // Conserver l'état précédent
      }
    });
  }



}
