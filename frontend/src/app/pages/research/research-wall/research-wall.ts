import { Component, afterNextRender, inject, signal } from '@angular/core';
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
  /** Empty in the prerendered page: pointing needs the script, so only it tells to point (RS-MOTION-P-03). */
  readonly hint = signal('');
  private hot?: Element;

  constructor() {
    afterNextRender(() => this.hint.set(this.wall.hint));
  }

  /** Pointing at a tile names its protocol and thickens its lines (RS-MOTION-04). */
  point(event: Event): void {
    const tile = (event.target as Element).closest('g[data-name]');
    if (!tile) return;
    this.hot?.classList.remove('hot');
    this.hot = tile;
    tile.classList.add('hot');
    this.hint.set(tile.getAttribute('data-name') ?? '');
  }

  leave(): void {
    this.hot?.classList.remove('hot');
    this.hot = undefined;
    this.hint.set(this.wall.hint);
  }
}
