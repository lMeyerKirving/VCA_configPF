import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesComponent } from '../shared/services/services.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-mbom-page',
  templateUrl: './mbom-page.component.html',
  styleUrls: ['./mbom-page.component.css'],
  standalone: true,
  imports: [
    NgForOf
  ]
})
export class MBOMPageComponent implements OnInit {
  mboms: any[] = [];
  numArt: string | null = '41329';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private services: ServicesComponent
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      //this.numArt = params.get('objectID'); // Récupérer l'ID de l'objet
      this.numArt = ('41329');
      if (this.numArt) {
        this.fetchMBOMs(this.numArt);
      } else {
        console.error('numArt (objectID) is missing');
      }
    });


  }

  fetchMBOMs(numArt: string): void {
    this.services.getMBOM(numArt).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.mboms = response.data;
          console.log('MBOMs:', this.mboms);
        } else {
          console.warn('No MBOM data found');
        }
      },
      error: (error) => {
        console.error('Error fetching MBOMs:', error);
      },
    });
  }
}
