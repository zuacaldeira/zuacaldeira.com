import { Component, inject } from '@angular/core';
import { SectionHeader } from '../../common/section-header/section-header';
import { ProjectCard } from './project-card/project-card';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-work',
  imports: [SectionHeader, ProjectCard],
  templateUrl: './work.html',
  styleUrl: './work.css',
})
export class Work {
  private contentService = inject(ContentService);
  readonly projects = this.contentService.projects;
}
