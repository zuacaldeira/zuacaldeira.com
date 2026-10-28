import { Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * The 74 distinct lattices realised at rung R2′ by 104 of the ICE 2026 paper's 108
 * benchmark protocols (four are excluded — see scripts/lattice-wall/README.md), tiled
 * as an azulejo wall. R2′ is not the paper's own construction: under the paper's R1 the
 * same corpus gives 41 lattices, 15 non-distributive, so don't cite the paper's census
 * for what is drawn here. The SVG body is generated — never hand-edit
 * lattice-wall.html; run scripts/lattice-wall/render.py.
 */
@Component({
  selector: 'app-lattice-wall',
  imports: [],
  templateUrl: './lattice-wall.html',
  styleUrl: './lattice-wall.css',
})
export class LatticeWall {
  private readonly host = inject(ElementRef);
  private tile?: SVGGElement;
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    // One randomly chosen tile wakes up flickering like a loose neon sign, then
    // settles into the pattern. Browser-only (the prerendered markup is untouched)
    // and skipped entirely under reduced motion.
    afterNextRender(() => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.flickerRandomTile();
      }
    });
    inject(DestroyRef).onDestroy(() => this.settle());
  }

  /**
   * Flickers one random tile and settles it once the stutter has played. Only one
   * tile wakes at a time — starting a new flicker settles the previous one.
   */
  flickerRandomTile(): void {
    const tiles = this.host.nativeElement.querySelectorAll('svg.wall > g.t');
    if (!tiles.length) {
      return;
    }
    this.settle();
    this.tile = tiles[Math.floor(Math.random() * tiles.length)] as SVGGElement;
    this.tile.classList.add('flicker');
    this.timer = setTimeout(() => this.settle(), 3000);
  }

  private settle(): void {
    clearTimeout(this.timer);
    this.tile?.classList.remove('flicker');
    this.tile = undefined;
  }
}
