import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFound } from './not-found';

// HOME-PAGE-06: one English page for every unknown path (D9).
describe('NotFound', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  const render = () => {
    const fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('HOME-PAGE-06: should say the page is not found and lead back to the English home', () => {
    const page = render();
    expect(page.querySelector('h1')?.textContent?.trim()).toBe('⊥ Page not found');
    expect(page.querySelector('p')?.textContent?.trim()).toBe(
      'This path ends at the bottom: there is no page here.',
    );
    const link = page.querySelector('a');
    expect(link?.textContent?.trim()).toBe('Back to the home page');
    expect(link?.getAttribute('href')).toBe('/en/home');
  });
});
