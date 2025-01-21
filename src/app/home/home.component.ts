import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {ServicesComponent} from '../shared/services/services.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    HttpClientModule,
    NgClass
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Liste des éléments codés en dur
  items: { name: string, link: string, image?: string  }[] = [
    { name: 'Bague', link: '/bague', image: 'baguee.png' },
    { name: 'Bracelet', link: '/bracelet' },
    { name: 'Sautoir', link: '/sautoir' },
    { name: 'Collier', link: '/collier' },
    { name: 'Pendentif', link: '/pendentif' },
    { name: 'MO', link: '/mo' },
    { name: 'Clip', link: '/clip' },
    { name: 'Clip Pendentif', link: '/clip-pendentif' },
    { name: 'Chaîne', link: '/chaine' },
    { name: 'Bouton de manchette', link: '/bouton-de-manchette' },
    { name: 'Montre', link: '/montre' },
    { name: 'Alliance', link: '/alliance' },
    { name: 'Solitaire', link: '/solitaire' },
    { name: 'Médaille', link: '/medaille' },
    { name: 'Charm', link: '/charm' },
    { name: 'Baleine de col', link: '/baleine-de-col' },
    { name: 'Épingle', link: '/epingle' }
  ];

  selectedItem: string | null = null;

  columns: number = 4;
  protected readonly Math = Math;


  constructor(private route: ActivatedRoute, private _ServicesComponent: ServicesComponent, private router: Router) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.selectedItem = params.get('item');
    });
    this.initLogin();
  }

private initLogin(){
  this._ServicesComponent.autologin().subscribe({
    next:(data) => {
      if(data){
        console.log("login success : ", data);
      }
    },
    error: (error) => {
      console.error("Autologin failed:", error);
    }
  })
}

  navigateToMBOM(): void {
    // Navigation vers la page MBOM
    this.router.navigate(['/mbom']);
  }

}
