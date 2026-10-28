import { Component, computed, inject } from '@angular/core';
import { SectionHeader } from '../../common/section-header/section-header';
import { ProjectCard } from './project-card/project-card';
import { ContentService } from '../../services/content.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-work',
  imports: [SectionHeader, ProjectCard],
  templateUrl: './work.html',
  styleUrl: './work.css',
})
export class Work {
  private contentService = inject(ContentService);
  readonly t = inject(I18nService).translations;
  readonly projects = computed(() =>
    this.contentService.projects.map((project, i) => ({
      ...project,
      description: this.t().projects[i]?.description ?? project.description,
    }))
  );
}
