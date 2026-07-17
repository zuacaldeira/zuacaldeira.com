import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { I18nService } from '../../../services/i18n.service';
import { LatticeWall } from './lattice-wall/lattice-wall';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, MatButtonModule, LatticeWall],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  readonly t = inject(I18nService).translations;
}
