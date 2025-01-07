import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgForOf} from '@angular/common';
import {ServicesComponent} from '../shared/services/services.component';
import {PopupTableComponent} from '../popup-table/popup-table.component';

@Component({
  selector: 'app-creation',
  standalone: true,
  templateUrl: './creation.component.html',
  imports: [
    NgForOf,
    PopupTableComponent
  ],
  styleUrls: ['./creation.component.css']
})
export class CreationComponent {
  selectedJewelry: string | null = null;
  customizationOptions: string[] = [];
  selectedOptions: Record<string, string> = {};
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
    console.log('ngOnInit called'); // Vérifiez que cette méthode est bien appelée

    this.route.queryParamMap.subscribe(params => {
      this.selectedJewelry = params.get('jewelry'); // Récupère le paramètre de la query string
      console.log('Selected Jewelry:', this.selectedJewelry); // Vérifiez la valeur
      this.loadCustomizationOptions();
    });
  }


  loadCustomizationOptions(): void {
    if (!this.selectedJewelry) {
      console.error('No jewelry selected'); // Vérifiez si le paramètre est vide
      return;
    }

    this.customizationOptions = this.typeMapping[this.selectedJewelry] || [];
    console.log('Customization Options:', this.customizationOptions); // Log les options
  }

  onCustomize(option: string): void {
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
