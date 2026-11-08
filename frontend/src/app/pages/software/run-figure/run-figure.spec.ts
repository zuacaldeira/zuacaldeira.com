import { TestBed } from '@angular/core/testing';
import { RunFigure } from './run-figure';

describe('RunFigure', () => {
  const render = (label = 'Der Schritt Run'): HTMLElement => {
    const fixture = TestBed.createComponent(RunFigure);
    fixture.componentRef.setInput('label', label);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('SW-LEAD-05: should be an image named by its translated label, with the label as its caption', () => {
    const el = render();
    const svg = el.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toBe('Der Schritt Run');
    expect(el.querySelector('figcaption')?.textContent?.trim()).toBe('Der Schritt Run');
  });
});
