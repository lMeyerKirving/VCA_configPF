import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-creation',
  standalone: true,
  templateUrl: './creation.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./creation.component.css']
})
export class CreationComponent {
  selectedJewelry: string | null = null; // Nom du bijou sélectionné
  customizationOptions: string[] = []; // Liste des types pour le bijou sélectionné
  selectedOptions: Record<string, string> = {}; // Choix actuels faits par l'utilisateur

  private typeMapping: Record<string, string[]> = {
    'Bague entre les doigts': ['Corps de bague', 'Motif', 'Motif'],
    'Bague simple': ['Corps de bague', 'Motif'],
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

  constructor(private route: ActivatedRoute, private router: Router) {
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
    // Naviguer ou ouvrir une pop-up pour personnaliser l'option
    this.router.navigate([`/search/${option}`]);
  }

  updateSelectedOption(option: string, value: string): void {
    // Met à jour les informations du bijou en fonction des choix faits
    this.selectedOptions[option] = value;
  }
}
