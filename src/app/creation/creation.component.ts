import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { ServicesComponent } from '../shared/services/services.component';
import { PopupTableComponent } from '../popup-table/popup-table.component';

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
  public sessionID : string | null = "";
  public objectID: string | null = "";

  itemInfo: { titrePage: string } | null = null;
  selectedJewelry: string | null = '';
  customizationOptions: string[] = []; // Liste des types d'attributs affichés en boutons
  dynamicAttributes: any[] = []; // Stocke les attributs récupérés dynamiquement

  selectedOptions: Record<string, { designation: string; reference: string; num_art: string }> = {};

  popupData: any[] = []; // Données pour le tableau dans la pop-up
  isPopupVisible: boolean = false; // Contrôle de la visibilité de la pop-up
  currentOption: string | null = null; // Option en cours de personnalisation

  nomenclature: { nom_type: string, type_objet: string, designation: string, reference: string }[] = [];


  constructor(private route: ActivatedRoute, private router: Router, private _ServicesComponent: ServicesComponent) {
    console.log('CreationComponent instantiated');
  }

  ngOnInit(): void {
    console.log('ngOnInit called');

    this.initLogin();

    this.route.queryParamMap.subscribe(params => {
      this.sessionID = params.get('sessionID');
      this.objectID = params.get('objectID');
      this.num_art = params.get('num_art') || '';
      this.selectedJewelry = params.get('jewelry');

      const option = params.get('option');
      const selectedDesignation = params.get('selectedDesignation');
      const selectedReference = params.get('selectedReference');
      const selectedNumArt = params.get('selectedNumArt');
      const savedState = params.get('state');

      if (!this.sessionID || !this.objectID) {
        console.error('Paramètres sessionID ou objectID manquants');
      } else {
        console.log('Session ID:', this.sessionID);
        console.log('Object ID:', this.objectID);

        this.fetchItemInfo(this.objectID);

      }

      if (savedState) {
        this.selectedOptions = JSON.parse(savedState);
      }

      if (option && selectedDesignation && selectedReference && selectedNumArt) {
        this.selectedOptions[option] = {
          designation: selectedDesignation,
          reference: selectedReference,
          num_art: selectedNumArt,
        };
      }

      this.loadDynamicAttributes();
      this.loadNomenclature();
    });
  }


  loadDynamicAttributes(): void {
    if (this.selectedJewelry) {
      this._ServicesComponent.getAttribut(this.selectedJewelry).subscribe({
        next: (response) => {
          console.log("Attributs récupérés:", response);
          if (response && response.data) {
            this.dynamicAttributes = response.data; // Stocke les données récupérées
            this.customizationOptions = response.data.map((attr: { type: any; }) => attr.type); // Extrait seulement les types
          } else {
            console.warn("Aucun attribut trouvé pour ce bijou.");
          }
        },
        error: (error) => {
          console.error("Erreur lors de la récupération des attributs:", error);
        }
      });
    } else {
      console.log("Pas de bijou sélectionné");
    }
  }

  onCustomize(option: string): void {
    const nomenclatureItem = this.nomenclature.find(n => n.type_objet === option);
    const nom_type = nomenclatureItem ? nomenclatureItem.nom_type : ''; // Récupération de la table source

    this.router.navigate(['/selection'], {
      queryParams: {
        jewelry: this.selectedJewelry,
        option,
        state: JSON.stringify(this.selectedOptions),
        sessionID: this.sessionID,
        objectID: this.objectID,
        num_art: this.num_art,
        nom_type: nom_type  // Ajout du nom_type à l'URL
      },
    });
  }

  private initLogin(): void {
    console.log("initLogin is running!");

    const currentUrl = window.location.href;
    const urlObject = new URL(currentUrl);
    const baseUrl = `${urlObject.origin}/`;
    this._ServicesComponent.audrosServer = baseUrl;

    this.route.queryParamMap.subscribe(params => {
      this.num_art = params.get('objectID') || "";
      this.sessionID = params.get('sessionID') || "";
    });

    console.log('Base URL :', baseUrl);
    console.log('sessionID:', this.sessionID);
    console.log('ref_pere (objectID):', this.num_art);

    if(this.sessionID){
      this._ServicesComponent.log(this.sessionID).subscribe({
        next: (data) => {
          if (data) {
            console.log("Autologin successful, data is:", data);
          }
        },
        error: (error) => {
          console.error("Autologin failed:", error);
        }
      });
    }else{
      console.error("Session ID manquant")
    }

  }

  private fetchItemInfo(objectID: string): void {
    this._ServicesComponent.getItem(objectID).subscribe({
      next: (response) => {
        if (response && response.data && response.data.length > 0) {
          this.itemInfo = response.data[0];
          console.log('Item Info reloaded:', this.itemInfo);
        } else {
          console.warn('Aucune donnée trouvée pour cet objet');
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des informations de l\'objet :', error);
      },
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

  onSave(): void {
    console.log('Saving attributes and creating links...');

    for (const [attribute, value] of Object.entries(this.selectedOptions)) {
      if (value && value.num_art) {
        const linkData = {
          linkClass: 'SYS_mBOM', // Classe du lien
          parentID: this.num_art, // ID du parent (la nomenclature)
          childID: value.num_art, // ID de l'attribut sélectionné
          quantity: 0, // Quantité
          flag: '', // Flag vide
          ordre: '1', // Ordre
        };

        console.log(value.num_art);

        this._ServicesComponent.addNewLink(linkData).subscribe({
          next: (response) => {
            console.log(`Link created successfully for attribute ${attribute}:`, response);
          },
          error: (error) => {
            console.error(`Error creating link for attribute ${attribute}:`, error);
          },
        });
      } else {
        console.warn(`Attribute ${attribute} is missing num_art and will not be linked.`);
      }
    }
  }

  loadNomenclature(): void {
    if (this.num_art) {
      this._ServicesComponent.getChild(this.num_art).subscribe({
        next: (response) => {
          console.log("Nomenclature récupérée:", response);
          if (response && response.data) {
            this.nomenclature = response.data.flatMap((item: any) =>
              item.types.flatMap((type: any) =>
                type.details.map((detail: any) => ({
                  type_objet: detail.type_objet,
                  designation: detail.designation,
                  reference: detail.ref_utilisat,
                }))
              )
            );
            console.log("Liste de la nomenclature:", this.nomenclature);
          } else {
            console.warn("Aucune nomenclature trouvée.");
          }
        },
        error: (error) => {
          console.error("Erreur lors de la récupération de la nomenclature:", error);
        },
      });
    }
  }

  getNomenclature(type: string) {
    return this.nomenclature.find(n => n.type_objet === type);
  }


}
