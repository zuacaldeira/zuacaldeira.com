import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Race } from '../../../models/models';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-race-card',
  imports: [MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './race-card.html',
  styleUrl: './race-card.css',
})
export class RaceCard {
  readonly t = inject(I18nService).translations;
  @Input({ required: true }) race!: Race;
}
