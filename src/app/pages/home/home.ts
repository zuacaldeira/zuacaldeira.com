import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { RoleCards } from './role-cards/role-cards';

@Component({
  selector: 'app-home',
  imports: [Hero, RoleCards],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
