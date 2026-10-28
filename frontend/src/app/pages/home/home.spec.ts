import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Home } from './home';
import { I18nService } from '../../services/i18n.service';

describe('Home', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).overrideComponent(Home, { set: { schemas: [NO_ERRORS_SCHEMA] } });
  });

  const create = () => TestBed.createComponent(Home);

  it('should create', () => {
    const fixture = create();
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('HOME-PAGE-03: should title the page with the name and the tagline in its language', () => {
    TestBed.inject(I18nService).setLanguage('pt');
    create().detectChanges();
    expect(TestBed.inject(Title).getTitle()).toBe(
      'Alexandre Caldeira — Investigador. Programador. Educador. Corredor.',
    );
  });
});
