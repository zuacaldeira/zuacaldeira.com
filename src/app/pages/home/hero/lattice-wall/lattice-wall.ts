import { Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * The 41 distinct lattices realised by the 108 benchmark protocols of the ICE 2026
 * paper, tiled as an azulejo wall. The SVG body is generated — never hand-edit
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
