import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioProject } from '../../../models/models';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-project-card',
  imports: [MatCardModule, MatChipsModule, MatButtonModule, MatIconModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {
  readonly t = inject(I18nService).translations;
  @Input({ required: true }) project!: PortfolioProject;
}
