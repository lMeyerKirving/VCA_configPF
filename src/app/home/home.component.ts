import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    RouterLink,
    NgForOf
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Liste des éléments codés en dur
  items: { name: string, link: string }[] = [
    { name: 'Bague', link: '/bague' },
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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedItem = params.get('item');
    });
  }
}
