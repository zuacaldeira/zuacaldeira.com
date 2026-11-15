import { TestBed } from '@angular/core/testing';
import { LogoMark } from './logo-mark';

describe('LogoMark', () => {
  it('LOGO-05: draws the diamond as the spec: four edges, then ⊤, the two atoms and the open ⊥', async () => {
    const fixture = TestBed.createComponent(LogoMark);
    await fixture.whenStable();
    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg');
    const at = (el: Element, names: string[]) => names.map((n) => el.getAttribute(n)).join(' ');
    const parts = [...(svg?.children ?? [])].map((el) =>
      el.tagName === 'line'
        ? `line ${at(el, ['x1', 'y1', 'x2', 'y2'])}`
        : `${el.tagName} ${at(el, ['cx', 'cy', 'r'])} ${el.getAttribute('class')}`,
    );
    expect({
      viewBox: svg?.getAttribute('viewBox'),
      hidden: svg?.getAttribute('aria-hidden'),
      focusable: svg?.getAttribute('focusable'),
      stroke: svg && at(svg, ['stroke-width', 'stroke-linecap']),
      parts,
    }).toEqual({
      viewBox: '0 0 48 48',
      hidden: 'true',
      focusable: 'false',
      stroke: '3 round',
      parts: [
        'line 24 7 8 24',
        'line 24 7 40 24',
        'line 8 24 24 41',
        'line 40 24 24 41',
        'circle 24 7 5.5 top',
        'circle 8 24 4.5 atom',
        'circle 40 24 4.5 atom',
        'circle 24 41 4.5 bottom',
      ],
    });
  });
});
