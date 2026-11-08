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

  it('SW-LEAD-05: should label the step, its action and its three results in notation, untranslated', () => {
    const labels = [...render().querySelectorAll('svg text')].map((t) => t.textContent?.trim());
    expect(labels).toEqual(['Run', '&{runTest}', '+RED', '+WRONG_RED', '+GREEN', 'Code', 'Fix', 'Green']);
  });

  it('SW-LEAD-05: should draw the action solid and the three results dashed, not by colour alone', () => {
    const edges = [...render().querySelectorAll('svg .edge')].map(
      (edge) => `${edge.classList.contains('edge--action') ? 'action' : 'result'} ${edge.getAttribute('stroke-dasharray') ?? 'solid'}`,
    );
    expect(edges).toEqual(['action solid', 'result 5 4', 'result 5 4', 'result 5 4']);
  });
});
