import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface RoleCard {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-role-cards',
  imports: [RouterLink, MatCardModule, MatIconModule],
  templateUrl: './role-cards.html',
  styleUrl: './role-cards.css',
})
export class RoleCards {
  readonly roles: RoleCard[] = [
    {
      title: 'Researcher',
      description: 'Session Types, POPL, with Vasco Vasconcelos at University of Lisbon.',
      icon: 'science',
      route: '/research',
    },
    {
      title: 'Developer',
      description: 'Angular + Spring Boot. Building web apps for the Casa Azul ecosystem.',
      icon: 'code',
      route: '/work',
    },
    {
      title: 'Educator',
      description: 'Erzieher in Ausbildung at Freie Fachschule Berlin.',
      icon: 'school',
      route: '/paedagogik',
    },
    {
      title: 'Runner',
      description: 'Amateur runner training for Berlin races and marathons.',
      icon: 'directions_run',
      route: '/running',
    },
  ];
}
