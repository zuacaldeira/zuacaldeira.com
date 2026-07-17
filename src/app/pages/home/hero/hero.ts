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
      const photo = hero?.querySelector('.hero__photo img') as HTMLElement | null;
      const lattice = hero?.querySelector('.hero__lattice') as HTMLElement | null;
      if (!hero || (!photo && !lattice)) {
        return;
      }

      let ticking = false;
      const apply = () => {
        // Rect-based, not window.scrollY: on mobile the content scrolls inside the
        // sidenav container, not the window, so scrollY would stay 0. The hero's top
        // relative to the viewport works for any scroller. Transforms are set directly
        // on the layers (no CSS var/calc in between) so nothing can swallow the update.
        const rect = hero.getBoundingClientRect();
        const height = rect.height || window.innerHeight;
        const progress = Math.min(Math.max(-rect.top / (height * 0.7), 0), 1);
        // Magnitudes stay within the pre-scale headroom on the smallest (560px) hero.
        if (photo) {
          photo.style.transform = `translateY(${(progress * 54).toFixed(1)}px) scale(1.22)`;
        }
        if (lattice) {
          lattice.style.transform = `translateY(${(progress * -36).toFixed(1)}px) scale(1.16)`;
        }
        ticking = false;
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(apply);
        }
      };

      this.zone.runOutsideAngular(() => {
        // Capture phase so scroll from an inner container (the mobile sidenav) is seen
        // too — scroll events don't bubble, but they can be caught on the way down.
        document.addEventListener('scroll', onScroll, { capture: true, passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
      });
      apply();

      this.destroyRef.onDestroy(() => {
        document.removeEventListener('scroll', onScroll, { capture: true });
        window.removeEventListener('resize', onScroll);
      });
    });
  }
}
