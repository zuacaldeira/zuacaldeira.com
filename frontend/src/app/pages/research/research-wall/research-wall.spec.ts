import { provideTestContent } from '../../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { ResearchWall } from './research-wall';
import { I18nService } from '../../../services/i18n.service';

describe('ResearchWall', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  const show = (lang: 'en' | 'de' | 'pt') => {
    TestBed.inject(I18nService).setLanguage(lang);
    const fixture = TestBed.createComponent(ResearchWall);
    fixture.detectChanges();
    return { fixture, wall: fixture.nativeElement as HTMLElement };
  };

  it('RS-WALL-02: should label the wall as one image and caption it, in the page language', () => {
    const { wall } = show('de');
    const svg = wall.querySelector('figure svg');
    expect({
      role: svg?.getAttribute('role'),
      label: svg?.getAttribute('aria-label'),
      caption: wall.querySelector('figure figcaption')?.textContent?.trim(),
    }).toEqual({ role: 'img', label: 'wall label de', caption: 'wall caption de' });
  });

  it('RS-MOTION-04, RS-MOTION-P-03: should name the tile pointed at, and bring the hint back on leaving the wall', async () => {
    const { fixture, wall } = show('pt');
    await fixture.whenStable();
    const hint = () => wall.querySelector('figure p[aria-hidden="true"]')?.textContent?.trim();
    const hot = () => [...wall.querySelectorAll('g.hot')].map((g) => g.getAttribute('data-name'));
    const shown = [{ hint: hint(), hot: hot() }];

    const tile = wall.querySelector('g[data-name="Two-Phase Commit"]')!;
    tile.querySelector('line')!.dispatchEvent(new Event('pointerover', { bubbles: true }));
    fixture.detectChanges();
    shown.push({ hint: hint(), hot: hot() });

    wall.querySelector('svg')!.dispatchEvent(new Event('pointerleave'));
    fixture.detectChanges();
    shown.push({ hint: hint(), hot: hot() });

    expect(shown).toEqual([
      { hint: 'wall hint pt', hot: [] },
      { hint: 'Two-Phase Commit', hot: ['Two-Phase Commit'] },
      { hint: 'wall hint pt', hot: [] },
    ]);
  });

  describe('drawing in', () => {
    // A stand-in for the browser's observer: the test says when the wall is in view.
    class FakeObserver {
      static last?: FakeObserver;
      readonly observed: Element[] = [];
      constructor(
        readonly report: (entries: { isIntersecting: boolean; target: Element }[]) => void,
        readonly options: { threshold?: number },
      ) {
        FakeObserver.last = this;
      }
      observe(el: Element) {
        this.observed.push(el);
      }
      unobserve() {}
      disconnect() {}
    }

    beforeEach(() => (FakeObserver.last = undefined));
    afterEach(() => vi.unstubAllGlobals());

    const drawn = (wall: HTMLElement) => wall.querySelector('svg')!.classList.contains('in');

    it('RS-MOTION-01, RS-MOTION-P-02: should draw the wall in once a quarter of it is in view, and not before', async () => {
      vi.stubGlobal('IntersectionObserver', FakeObserver);
      const { fixture, wall } = show('en');
      await fixture.whenStable();
      expect(FakeObserver.last, 'an observer watches the wall').toBeDefined();
      const observer = FakeObserver.last!;
      const svg = wall.querySelector('svg')!;
      const steps = [drawn(wall)];
      observer.report([{ isIntersecting: false, target: svg }]);
      steps.push(drawn(wall));
      observer.report([{ isIntersecting: true, target: svg }]);
      steps.push(drawn(wall));
      expect({ watched: observer.observed, threshold: observer.options.threshold, steps }).toEqual({
        watched: [svg],
        threshold: 0.25,
        steps: [false, false, true],
      });
    });

    it('RS-MOTION-01 (D13): should draw the wall at once where the browser cannot tell what is in view', async () => {
      vi.stubGlobal('IntersectionObserver', undefined);
      const { fixture, wall } = show('en');
      await fixture.whenStable();
      expect(drawn(wall)).toBe(true);
    });
  });
});
