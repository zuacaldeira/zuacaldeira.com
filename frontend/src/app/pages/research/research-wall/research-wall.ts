import { Component, inject, signal } from '@angular/core';
import { RESEARCH_CONTENT } from '../../../content/content';
import { I18nService } from '../../../services/i18n.service';

/**
 * The Research page's wall: the 74 distinct lattices of the ICE 2026 paper's benchmark protocols at
 * rung R2′, which is not the paper's own construction (scripts/lattice-wall/README.md). The
 * template is generated: never edit research-wall.html, run scripts/lattice-wall/render.py (D8,
 * D14 in docs/examples/research.md).
 */
@Component({
  selector: 'app-research-wall',
  templateUrl: './research-wall.html',
})
export class ResearchWall {
  readonly wall = inject(RESEARCH_CONTENT).wall[inject(I18nService).language()];
  readonly hint = signal('');

  point(_event: Event): void {}

  leave(): void {}
}
