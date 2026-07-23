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
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // One randomly chosen tile wakes up flickering like a loose neon sign, then
    // settles into the pattern. Browser-only (the prerendered markup is untouched)
    // and skipped entirely under reduced motion.
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      this.flickerRandomTile();
    });
  }

  /** Adds .flicker to one random tile and removes it once the stutter has played. */
  flickerRandomTile(): void {
    const tiles = this.host.nativeElement.querySelectorAll('svg.wall > g.t');
    if (!tiles.length) {
      return;
    }
    const tile = tiles[Math.floor(Math.random() * tiles.length)] as SVGGElement;
    tile.classList.add('flicker');
    const timer = setTimeout(() => tile.classList.remove('flicker'), 3000);
    this.destroyRef.onDestroy(() => {
      clearTimeout(timer);
      tile.classList.remove('flicker');
    });
  }
}
