import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NotFound } from './not-found';
import { I18nService } from '../../services/i18n.service';

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

  it('HOME-PAGE-06: should stay English, lang included, after a German page', () => {
    TestBed.inject(I18nService).setLanguage('de');
    TestBed.inject(DOCUMENT).documentElement.lang = 'de';
    const page = render();
    expect(page.querySelector('h1')?.textContent?.trim()).toBe('⊥ Page not found');
    expect(TestBed.inject(DOCUMENT).documentElement.lang).toBe('en');
  });

  it('HOME-PAGE-06: should title the page with the name and "Page not found" (D29)', () => {
    render();
    expect(TestBed.inject(Title).getTitle()).toBe('Alexandre Caldeira — Page not found');
  });
});
