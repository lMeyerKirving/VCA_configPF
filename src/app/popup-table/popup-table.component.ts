import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface TableFilters {
  ref_utilisat: string;
  designation: string;
  version: string;
  revision: string;
}

@Component({
  selector: 'app-popup-table',
  templateUrl: './popup-table.component.html',
  styleUrls: ['./popup-table.component.css'],
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule // Import pour utiliser [(ngModel)]
  ]
})

export class PopupTableComponent {
  @Input() data: any[] = []; // Données originales
  @Input() show: boolean = false; // Contrôle de la visibilité
  @Output() close = new EventEmitter<void>(); // Événement pour fermer la pop-up
  @Output() selectItem = new EventEmitter<any>(); // Événement pour sélectionner une ligne

  searchQuery: string = ''; // Texte de recherche global (optionnel)
  filters: TableFilters = {
    ref_utilisat: '',
    designation: '',
    version: '',
    revision: ''
  };// Stocke les filtres de chaque colonne
  filteredData: any[] = []; // Données filtrées

  ngOnChanges(): void {
    // Mettre à jour les données filtrées chaque fois que `data` change
    this.filteredData = [...this.data];
  }

  onClose(): void {
    this.close.emit();
  }

  onSelect(item: any): void {
    this.selectItem.emit(item);
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
}
