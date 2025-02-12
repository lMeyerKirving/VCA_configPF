import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesComponent } from '../shared/services/services.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Pour la liaison bidirectionnelle avec [(ngModel)]

@Component({
  selector: 'app-mbom-page',
  templateUrl: './mbom-page.component.html',
  styleUrls: ['./mbom-page.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    NgClass,
  ]
})
export class MBOMPageComponent implements OnInit {
  mboms: any[] = [];
  objectID: string | null = null;
  sessionID: string | null = null;

  suppliers: { ref_utilisat: string, num_art: string }[] = []; // Liste des fournisseurs avec leur num_art
  selectedSupplier: { ref_utilisat: string, num_art: string } | null = null; // Fournisseur sélectionné

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private services: ServicesComponent
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.objectID = params.get('objectID');
      this.sessionID = params.get('sessionID');

      const currentUrl = window.location.href;
      const urlObject = new URL(currentUrl);
      const baseUrl = `${urlObject.origin}/`;
      this.services.audrosServer = baseUrl;

      if (this.sessionID) {
        this.services.log(this.sessionID).subscribe({
          next: (data) => {
            console.log('Autologin successful:', data);
            if (this.objectID) {
              this.fetchMBOMs(this.objectID);
            } else {
              console.error('ObjectID is missing.');
            }
            this.fetchSuppliers(); // 🔥 Récupération dynamique des fournisseurs
          },
          error: (error) => {
            console.error('Autologin failed:', error);
          }
        });
      } else {
        console.error('Session ID is missing.');
      }
    });
  }

  fetchMBOMs(numArt: string): void {
    this.services.getMBOM(numArt).subscribe({
      next: (response) => {
        console.log('Raw MBOM Response:', response);
        if (response && response.data) {
          this.mboms = response.data.flatMap((entry: any) =>
            entry.mbom.map((mbomEntry: any) => ({
              ref_utilisat: mbomEntry.ref_utilisat || 'Non défini',
              version: mbomEntry.version || 'Non défini',
              revision: mbomEntry.revision || 'Non défini',
              designation: mbomEntry.designation || 'Non défini',
              num_art: mbomEntry.num_art || '',
            }))
          );
          console.log('Processed MBOMs:', this.mboms);
        } else {
          console.warn('No MBOM data found.');
        }
      },
      error: (error) => {
        console.error('Error fetching MBOMs:', error);
      },
    });
  }

  fetchSuppliers(): void {
    this.services.getFournisseur("").subscribe({
      next: (response) => {
        console.log("Fournisseurs récupérés:", response);
        if (response && response.data) {
          // Mappe les fournisseurs avec leurs `ref_utilisat` et `num_art`
          this.suppliers = response.data.map((item: { ref_utilisat: string, num_art: string }) => ({
            ref_utilisat: item.ref_utilisat,
            num_art: item.num_art,
          }));
          console.log("Liste des fournisseurs:", this.suppliers);
        } else {
          console.warn("Aucun fournisseur trouvé.");
        }
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des fournisseurs:", error);
      },
    });
  }

  navigateToCreation(numArt: string): void {
    this.router.navigate(['/creation'], {
      queryParams: {
        sessionID: this.sessionID,
        objectID: this.objectID,
        num_art: numArt, //num_art mbom
        jewelry: 'Bracelet ouvert', //TODO: Recuperer le type de bijoux de manière dynamique
      },
    });
  }

  createMBOM(): void {
    if (this.selectedSupplier) {
      console.log(`Créer une MBOM avec le fournisseur: ${this.selectedSupplier.ref_utilisat}, num_art: ${this.selectedSupplier.num_art}`);
      // Redirection vers la page de création avec le num_art du fournisseur
      this.router.navigate(['/creation'], {
        queryParams: {
          sessionID: this.sessionID,
          objectID: this.objectID,
          num_art: this.selectedSupplier.num_art, // Transmet le num_art du fournisseur
          jewelry: 'Bracelet ouvert', //TODO: Récupérer le type de bijoux de manière dynamique
        },
      });
    } else {
      console.warn('Aucun fournisseur sélectionné.');
    }
  }

}
