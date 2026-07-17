import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Hero } from './hero';

describe('Hero', () => {
  let component: Hero;
  let el: HTMLElement;

  beforeEach(() => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(Hero, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(Hero);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the name and the translated tagline', () => {
    expect(el.querySelector('.hero__name')?.textContent).toContain('Alexandre');
    expect(el.querySelector('.hero__tagline')?.textContent?.trim()).toBe(
      component.t().hero.tagline,
    );
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
