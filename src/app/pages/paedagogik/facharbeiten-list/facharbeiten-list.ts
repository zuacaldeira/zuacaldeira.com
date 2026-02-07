import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-facharbeiten-list',
  imports: [MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './facharbeiten-list.html',
  styleUrl: './facharbeiten-list.css',
})
export class FacharbeitenList {
  private contentService = inject(ContentService);
  readonly facharbeiten = this.contentService.facharbeiten;
}
