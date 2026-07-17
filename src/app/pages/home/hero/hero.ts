import { Component, DestroyRef, ElementRef, NgZone, afterNextRender, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { I18nService } from '../../../services/i18n.service';
import { LatticeWall } from './lattice-wall/lattice-wall';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, MatButtonModule, LatticeWall],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  readonly t = inject(I18nService).translations;

  private readonly host = inject(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Scroll parallax, driven from JS rather than a CSS scroll-timeline: it runs in
    // every browser (scroll-timelines are Chromium-only today) and is unaffected by
    // the root's overflow-x clip. It only sets one number, --hero-progress (0→1 as the
    // hero scrolls away); hero.css turns that into the layer transforms. afterNextRender
    // keeps it browser-only, so the prerendered page is untouched.
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      const hero = this.host.nativeElement.querySelector('.hero') as HTMLElement | null;
      if (!hero) {
        return;
      }

      let ticking = false;
      const apply = () => {
        const height = hero.offsetHeight || window.innerHeight;
        const progress = Math.min(Math.max(window.scrollY / (height * 0.9), 0), 1);
        hero.style.setProperty('--hero-progress', progress.toFixed(4));
        ticking = false;
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(apply);
        }
      };

      this.zone.runOutsideAngular(() => {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
      });
      apply();

      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      });
    });
  }
}
