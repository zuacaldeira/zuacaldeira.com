import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { I18nService } from '../../../services/i18n.service';

interface Atom {
  readonly route: string;
  readonly label: string;
  /** Centre of the atom's tile on the lattice's 760-unit x axis. */
  readonly x: number;
}

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  readonly t = inject(I18nService).translations;
  private readonly router = inject(Router);

  readonly topY = 31;
  readonly tileTopY = 117;
  readonly tileBottomY = 163;
  readonly bottomY = 249;
  readonly centreX = 380;

  /**
   * The atoms of the lattice, left to right. Labels are type notation rather than
   * prose — like the venue names and abstracts, they are not translated.
   */
  readonly atoms: readonly Atom[] = [
    { route: '/research', label: 'research', x: 100 },
    { route: '/work', label: 'development', x: 280 },
    { route: '/paedagogik', label: 'pedagogy', x: 460 },
    { route: '/running', label: 'running', x: 640 },
  ];

  /**
   * RouterLink only recognises HTML anchors, and these are SVGAElements, so the href
   * is authored directly — real, crawlable, middle-clickable — and the plain left
   * click is upgraded to in-app navigation here.
   */
  navigate(event: MouseEvent, route: string): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    this.router.navigateByUrl(route);
  }
}
