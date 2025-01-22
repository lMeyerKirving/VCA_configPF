import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesComponent } from '../shared/services/services.component';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-mbom-page',
  templateUrl: './mbom-page.component.html',
  styleUrls: ['./mbom-page.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ]
})
export class MBOMPageComponent implements OnInit {
  mboms: any[] = [];
  objectID: string | null = null;
  sessionID: string | null = null;

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

      // Extraction de l'origine (protocole + nom de domaine)
      const baseUrl = `${urlObject.origin}/`; // Exemple : "https://dms-server/"
      //const baseUrl = `https://dms-server/`;
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
        console.log('Raw MBOM Response:', response); // Log pour vérifier la structure des données
        if (response && response.data) {
          // Traiter les données pour extraire les informations nécessaires
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

  navigateToCreation(numArt: string): void {
    this.router.navigate(['/creation'], {
      queryParams: {
        sessionID: this.sessionID, // Conserver le sessionID
        objectID: this.objectID, // Conserver l'objectID principal
        num_art: numArt, // Transmettre l'ID de la MBOM sélectionnée
        jewelry: 'Bracelet ouvert', // Ajouter le type de bijou par défaut
      },
    });
  }
}
