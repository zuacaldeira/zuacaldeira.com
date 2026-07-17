import { Component } from '@angular/core';

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
export class LatticeWall {}
