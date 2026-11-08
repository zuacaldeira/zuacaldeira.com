import { TestBed } from '@angular/core/testing';
import { MonitorShot } from './monitor-shot';

describe('MonitorShot', () => {
  const render = (): HTMLElement => {
    const fixture = TestBed.createComponent(MonitorShot);
    fixture.componentRef.setInput('alt', 'Die Live-Ansicht des Monitors');
    fixture.componentRef.setInput('caption', 'Die Live-Ansicht');
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('SW-LEAD-06: should hold the light and the dark image, each in a link to its own full-size file', () => {
    const el = render();
    const shots = [...el.querySelectorAll('a')].map((a) => {
      const img = a.querySelector('img');
      return {
        href: a.getAttribute('href'),
        src: img?.getAttribute('src'),
        alt: img?.getAttribute('alt'),
        size: `${img?.getAttribute('width')}×${img?.getAttribute('height')}`,
        loading: img?.getAttribute('loading'),
      };
    });
    const shot = (mode: string) => ({
      href: `/assets/software/reticulab-live-${mode}.png`,
      src: `/assets/software/reticulab-live-${mode}.png`,
      alt: 'Die Live-Ansicht des Monitors',
      size: '1440×900',
      loading: 'lazy',
    });
    expect(shots).toEqual([shot('light'), shot('dark')]);
    expect([...el.querySelectorAll('figcaption')].map((c) => c.textContent?.trim())).toEqual([
      'Die Live-Ansicht',
    ]);
  });
});
