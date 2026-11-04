import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { LanguageLinks } from './language-links';
import { I18nService } from '../../services/i18n.service';

@Component({ template: '' })
class AnyPage {}

describe('LanguageLinks', () => {
  let fixture: ComponentFixture<LanguageLinks>;

  const links = () => [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')];

  /** The links as the page shows them, on `url` in the language `lang`. */
  async function showAt(url: string, lang: 'en' | 'de' | 'pt', form?: 'codes' | 'names') {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', component: AnyPage }])],
    });
    TestBed.inject(I18nService).setLanguage(lang);
    await TestBed.inject(Router).navigateByUrl(url);
    fixture = TestBed.createComponent(LanguageLinks);
    if (form) fixture.componentRef.setInput('form', form);
    await fixture.whenStable();
  }

  it('SHELL-01: shows EN, DE and PT in a navigation labelled "Sprache", each to its language', async () => {
    await showAt('/de/home', 'de');
    const nav = (fixture.nativeElement as HTMLElement).querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Sprache');
    expect(
      links().map((a) => [
        a.textContent?.trim(),
        a.getAttribute('href'),
        a.getAttribute('hreflang'),
        a.getAttribute('lang'),
        a.getAttribute('aria-label'),
      ]),
    ).toEqual([
      ['EN', '/en/home', 'en', 'en', 'English (EN)'],
      ['DE', '/de/home', 'de', 'de', 'Deutsch (DE)'],
      ['PT', '/pt/home', 'pt', 'pt', 'Português (PT)'],
    ]);
  });

  it('SHELL-01-P-01: marks only the page’s own language as current, DE on /de/home', async () => {
    await showAt('/de/home', 'de');
    expect(links().map((a) => a.getAttribute('aria-current'))).toEqual([null, 'page', null]);
  });

  it('SHELL-02-P-04: follows the visitor to another page, /de/research then /de/about', async () => {
    await showAt('/de/research', 'de');
    await TestBed.inject(Router).navigateByUrl('/de/about');
    await fixture.whenStable();
    expect(links().map((a) => a.getAttribute('href'))).toEqual([
      '/en/about',
      '/de/about',
      '/pt/about',
    ]);
  });

  it('SHELL-03: writes the names out in a plain list for the footer, Português current', async () => {
    await showAt('/pt/home', 'pt', 'names');
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('nav')).toBeNull();
    expect(
      [...host.querySelectorAll('ul > li > a')].map((a) => [
        a.textContent?.trim(),
        a.getAttribute('href'),
        a.getAttribute('hreflang'),
        a.getAttribute('lang'),
        a.getAttribute('aria-current'),
      ]),
    ).toEqual([
      ['English', '/en/home', 'en', 'en', null],
      ['Deutsch', '/de/home', 'de', 'de', null],
      ['Português', '/pt/home', 'pt', 'pt', 'page'],
    ]);
  });
});
