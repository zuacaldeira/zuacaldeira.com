import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTestContent } from '../../../content/content.testing';
import { I18nService } from '../../../services/i18n.service';
import { Hero } from './hero';

describe('Hero', () => {
  let component: Hero;
  let el: HTMLElement;

  let fixture: ComponentFixture<Hero>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideTestContent()],
    }).overrideComponent(Hero, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    TestBed.inject(I18nService).setLanguage('en');
    fixture = TestBed.createComponent(Hero);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the name', () => {
    expect(el.querySelector('.hero__name')?.textContent).toContain('Alexandre');
  });

  it("shows the sentence of the page's language from the build's snapshot as the h1", async () => {
    TestBed.inject(I18nService).setLanguage('de');
    await fixture.whenStable();

    expect(el.querySelector('h1')?.textContent?.trim()).toBe('headline de');
  });

  it('should show the hero photo with alt text', () => {
    const img = el.querySelector('.hero__photo img');
    expect(img?.getAttribute('src')).toContain('/assets/hero/');
    expect(img?.getAttribute('alt')?.length).toBeGreaterThan(0);
  });

  it('should link to /about and /contact', () => {
    const hrefs = Array.from(el.querySelectorAll('.hero__actions a')).map((a) =>
      a.getAttribute('href'),
    );
    expect(hrefs).toContain('/about');
    expect(hrefs).toContain('/contact');
  });

  it('should emboss the lattice into the glass layer', () => {
    expect(el.querySelector('.hero__lattice app-lattice-wall')).toBeTruthy();
  });
});
