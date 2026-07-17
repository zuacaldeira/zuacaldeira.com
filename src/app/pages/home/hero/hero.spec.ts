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
    expect(el.querySelector('.hero-name')?.textContent).toContain('Alexandre');
    expect(el.querySelector('.hero-tagline')?.textContent?.trim()).toBe(component.t().hero.tagline);
  });

  it('should present the lattice wall', () => {
    expect(el.querySelector('app-lattice-wall')).toBeTruthy();
  });
});
