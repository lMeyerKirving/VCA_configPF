import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {ServicesComponent} from '../shared/services/services.component';
import {PopupTableComponent} from '../popup-table/popup-table.component';

@Component({
  selector: 'app-creation',
  standalone: true,
  templateUrl: './creation.component.html',
  imports: [
    NgForOf,
    PopupTableComponent,
    NgIf
  ],
  styleUrls: ['./creation.component.css']
})


export class CreationComponent {
  private num_art = "";
  private sessionID = "";

  itemInfo: { titrePage: string } | null = null;


  selectedJewelry: string | null = null;
  customizationOptions: string[] = [];
  selectedOptions: Record<string, { designation: string; reference: string }> = {};

  popupData: any[] = []; // Données pour le tableau dans la pop-up
  isPopupVisible: boolean = false; // Contrôle de la visibilité de la pop-up
  currentOption: string | null = null; // Option en cours de personnalisation

  private typeMapping: Record<string, string[]> = {
    'Bague entre les doigts': ['corps', 'Motif', 'Motif'],
    'Bague simple': ['corps', 'motif'],
    'Bracelet ouvert': ['Brin mâle', 'Brin femelle', 'Axe charnière', 'Lame ressort', 'Motif A', 'Motif B'],
    'Bracelet rigide': ['Brin mâle'],
    'Bracelet souple': ['Mousqueton'],
    'Chaîne': ['Mousqueton'],
    'Clip': ['Motif'],
    'Clip Pendentif': ['Mousqueton'],
    'Collier': ['Mousqueton'],
    'MO Puce': ['Motif'],
    'MO Raquette': ['Motif'],
    'Manchette': ['Corps de manchette'],
    'Pendentif': ['Mousqueton'],
    'Pendentif (option 2)': ['Mousqueton'],
    'Sautoir': ['Mousqueton'],
    'Sautoir (option 2)': ['Mousqueton'],
  };

  constructor(private route: ActivatedRoute, private router: Router, private _ServicesComponent: ServicesComponent) {
    console.log('CreationComponent instantiated');
  }

  ngOnInit(): void {
    console.log('ngOnInit called');

    this.initLogin();

    // Récupérer et stocker les paramètres de l'URL (sessionID et objectID)
    this.route.queryParamMap.subscribe(params => {
      const sessionID = params.get('sessionID'); // Récupérer sessionID
      const objectID = params.get('objectID'); // Récupérer objectID
      this.selectedJewelry = params.get('jewelry'); // Récupérer le bijou sélectionné
      const option = params.get('option'); // Attribut en cours
      const selectedDesignation = params.get('selectedDesignation'); // Désignation sélectionnée
      const selectedReference = params.get('selectedReference'); // Référence sélectionnée
      const savedState = params.get('state'); // État précédent

      console.log('Query Params:', { sessionID, objectID, option, selectedDesignation, selectedReference, savedState });

      // Vérifier si sessionID et objectID sont présents, sinon journaliser une erreur
      if (!sessionID || !objectID) {
        console.error('Paramètres sessionID ou objectID manquants');
      } else {
        console.log('Session ID:', sessionID);
        console.log('Object ID:', objectID);
      }

      // Restaurer l'état précédent s'il existe
      if (savedState) {
        this.selectedOptions = JSON.parse(savedState);
      }

      // Mettre à jour l'attribut sélectionné si applicable
      if (option && selectedDesignation && selectedReference) {
        this.selectedOptions[option] = {
          designation: selectedDesignation,
          reference: selectedReference,
        };
      }

      this.loadCustomizationOptions();

      // Appeler le backend pour récupérer les informations de l'objet avec objectID
      this._ServicesComponent.getItem(objectID!).subscribe({
        next: (response) => {
          if (response && response.data && response.data.length > 0) {
            // Stockez la première ligne des résultats
            this.itemInfo = response.data[0];
            console.log('Item Info:', this.itemInfo);
          } else {
            console.warn('Aucune donnée trouvée pour cet objet');
          }
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des informations de l\'objet :', error);
        }
      });
    });
  }



  private initLogin(): void {
    console.log("initLogin is running!");
    // Récupération de l'URL complète
    const currentUrl = window.location.href;
    const urlObject = new URL(currentUrl);

    // Extraction de l'origine (protocole + nom de domaine)
    //const baseUrl = `${urlObject.origin}/`; // Exemple : "https://dms-server/"
    const baseUrl = `https://dms-server/`;
    this._ServicesComponent.audrosServer = baseUrl;

    // Extraction des paramètres de requête
    const queryParams = new URLSearchParams(urlObject.search);
    this.route.queryParamMap.subscribe(params => {
      this.num_art = queryParams.get('objectID') || "";
      this.sessionID = queryParams.get('sessionID') || "";
    });

    console.log('Base URL :', baseUrl);
    console.log('sessionID:', this.sessionID);
    console.log('ref_pere (objectID):', this.num_art);

    // this._ServicesComponent.log(this.sessionID).subscribe({
    //   next: (data) => {
    //     if (data) {
    //       console.log("Autologin successful, data is:", data);
    //     }
    //   },
    //   error: (error) => {
    //     console.error("Autologin failed:", error);
    //   }
    // });

  }


  loadCustomizationOptions(): void {
    if (!this.selectedJewelry) {
      console.error('No jewelry selected'); // Vérifiez si le paramètre est vide
      return;
    }

    this.customizationOptions = this.typeMapping[this.selectedJewelry] || [];
    console.log('Customization Options:', this.customizationOptions); // Log les options
  }

  /*onCustomize(option: string): void {
    this.currentOption = option;
    this._ServicesComponent.getType(option).subscribe(
      (response) => {
        if (response && response.data) {
          this.popupData = response.data; // Assurez-vous que popupData est un tableau
        } else {
          console.error('Data format incorrect:', response);
          this.popupData = []; // Assurez-vous de ne pas casser l'interface
        }
        this.isPopupVisible = true; // Affichez la pop-up
      },
      (error) => {
        console.error('Erreur lors de la récupération des données', error);
      }
    );
  }*/

  onCustomize(option: string): void {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionID = queryParams.get('sessionID');
    const objectID = queryParams.get('objectID');

    this.router.navigate(['/selection'], {
      queryParams: {
        jewelry: this.selectedJewelry, // Garder le bijou sélectionné
        option, // Attribut actuel
        state: JSON.stringify(this.selectedOptions), // Sauvegarder l'état des options
        sessionID, // Ajouter sessionID
        objectID // Ajouter objectID
      }
    });
  }





  onPopupClose(): void {
    this.isPopupVisible = false;
    this.currentOption = null;
  }

  onItemSelect(item: any): void {
    if (this.currentOption) {
      this.selectedOptions[this.currentOption] = item.designation; // Met à jour l'option sélectionnée
    }
    this.onPopupClose(); // Ferme la pop-up
  }

  onSave(){
    return;
  }

}
