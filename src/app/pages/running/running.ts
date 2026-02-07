import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SectionHeader } from '../../common/section-header/section-header';
import { RaceCard } from './race-card/race-card';
import { ContentService } from '../../services/content.service';
import { Race } from '../../models/models';

@Component({
  selector: 'app-running',
  imports: [MatButtonModule, MatIconModule, SectionHeader, RaceCard],
  templateUrl: './running.html',
  styleUrl: './running.css',
})
export class Running {
  private contentService = inject(ContentService);

  readonly upcomingRaces: readonly Race[] = this.contentService.races.filter((r) => r.upcoming);
  readonly completedRaces: readonly Race[] = this.contentService.races.filter((r) => !r.upcoming);
}
