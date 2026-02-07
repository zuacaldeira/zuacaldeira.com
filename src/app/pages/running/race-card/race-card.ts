import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Race } from '../../../models/models';

@Component({
  selector: 'app-race-card',
  imports: [MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './race-card.html',
  styleUrl: './race-card.css',
})
export class RaceCard {
  @Input({ required: true }) race!: Race;
}
