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
  sessionID: string | null = null; // Stocker sessionID
  objectID: string | null = null; // Stocker objectID
  num_art: string | null = null;
  nom_type: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private services: ServicesComponent) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentOption = params['option']; // Récupérer l'attribut cliqué
      this.sessionID = params['sessionID']; // Récupérer sessionID
      this.objectID = params['objectID']; // Récupérer objectID
      this.num_art = params['num_art'];
      this.nom_type = params['nom_type'];

      // 🔹 DEBUGGING LOGS 🔹
      console.log("✅ Paramètres récupérés dans selection-page.component.ts:");
      console.log("➡ currentOption:", this.currentOption);
      console.log("➡ sessionID:", this.sessionID);
      console.log("➡ objectID:", this.objectID);
      console.log("➡ num_art:", this.num_art);
      console.log("➡ nom_type:", this.nom_type);

      if (this.currentOption && this.nom_type) {
        console.log("🚀 Fetching data dans le if !");
        this.fetchData(this.currentOption, this.nom_type);
      } else {
        console.warn("⚠️ currentOption ou nom_type est undefined !");
      }
    });
  }


  fetchData(option: string, nom_type: string): void {
    this.services.getType(option, nom_type).subscribe(
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
        selectedNumArt: item.num_art, // Num_art récupéré
        state: savedState, // Conserver l'état précédent
        sessionID: this.sessionID, // Ajouter sessionID
        objectID: this.objectID, // Ajouter objectID
        num_art: this.num_art,

      }
    });
  }



}
