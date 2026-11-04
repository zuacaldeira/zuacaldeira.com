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
  async function showAt(url: string, lang: 'en' | 'de' | 'pt') {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', component: AnyPage }])],
    });
    TestBed.inject(I18nService).setLanguage(lang);
    await TestBed.inject(Router).navigateByUrl(url);
    fixture = TestBed.createComponent(LanguageLinks);
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
});
