import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
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
  styleUrl: './research-wall.css',
})
export class ResearchWall {
  readonly wall = inject(RESEARCH_CONTENT).wall[inject(I18nService).language()];
  /** Empty in the prerendered page: pointing needs the script, so only it tells to point (RS-MOTION-P-03). */
  readonly hint = signal('');
  private hot?: Element;

  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    let observer: IntersectionObserver | undefined;
    afterNextRender(() => {
      this.hint.set(this.wall.hint);
      // The lines wait hidden only under html.motion (D13); `in` draws them, once a quarter of the
      // wall is in view, or at once where the browser cannot tell (RS-MOTION-01, RS-MOTION-P-02).
      const svg = host.querySelector('svg')!;
      if (typeof IntersectionObserver === 'undefined') {
        svg.classList.add('in');
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries.filter((e) => e.isIntersecting)) {
            entry.target.classList.add('in');
            observer?.unobserve(entry.target);
          }
        },
        { threshold: 0.25 },
      );
      observer.observe(svg);
    });
    inject(DestroyRef).onDestroy(() => observer?.disconnect());
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
