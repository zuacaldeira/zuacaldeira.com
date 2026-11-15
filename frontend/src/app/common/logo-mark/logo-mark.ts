import { Component } from '@angular/core';

/**
 * The site's mark, the lattice diamond: the 2×2 Hasse diagram, ⊤ the join, ⊥ open where a protocol
 * starts (docs/mockups/brand/logo-spec.md, option A, Losango). Decorative: the link around it is named.
 */
@Component({
  selector: 'app-logo-mark',
  template: `
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      stroke-width="3"
      stroke-linecap="round"
    >
      <line x1="24" y1="7" x2="8" y2="24" />
      <line x1="24" y1="7" x2="40" y2="24" />
      <line x1="8" y1="24" x2="24" y2="41" />
      <line x1="40" y1="24" x2="24" y2="41" />
      <circle cx="24" cy="7" r="5.5" class="top" />
      <circle cx="8" cy="24" r="4.5" class="atom" />
      <circle cx="40" cy="24" r="4.5" class="atom" />
      <circle cx="24" cy="41" r="4.5" class="bottom" />
    </svg>
  `,
  styles: `
    :host {
      display: block;
    }
    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
  `,
})
export class LogoMark {}
