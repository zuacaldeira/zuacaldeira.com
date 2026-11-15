import { provideTestContent } from '../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { About } from './about';
import { I18nService } from '../../services/i18n.service';

describe('About', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  // The page in the page's language, as rendered.
  const render = (lang: 'en' | 'de' | 'pt'): HTMLElement => {
    TestBed.inject(I18nService).setLanguage(lang);
    const fixture = TestBed.createComponent(About);
    fixture.detectChanges();
    return fixture.nativeElement;
  };
  const texts = (page: HTMLElement, selector: string) =>
    [...page.querySelectorAll(selector)].map((el) => el.textContent?.trim());

  it('ABOUT-02: should title the page with the full name and its heading', () => {
    render('pt');
    expect(TestBed.inject(Title).getTitle()).toBe('Alexandre Zua Caldeira — about heading pt');
  });

  it('ABOUT-12 (D8): should list the four stops in a <nav> named the route, each a link to its chapter', () => {
    const page = render('de');
    const navs = [...page.querySelectorAll('nav')];
    expect(
      navs.map((nav) => ({
        label: nav.getAttribute('aria-label'),
        stops: [...nav.querySelectorAll(':scope ol > li > a')].map((a) => ({
          href: a.getAttribute('href'),
          chapter: a.querySelector('.about-route__chapter')?.textContent?.trim(),
          place: a.querySelector('.about-route__place')?.textContent?.trim(),
        })),
      })),
    ).toEqual([
      {
        label: 'route label de',
        stops: [
          { href: '/de/about#piri', chapter: 'chapter 1 de', place: 'Piri' },
          { href: '/de/about#estremoz', chapter: 'chapter 2 de', place: 'Estremoz' },
          { href: '/de/about#lisbon', chapter: 'chapter 3 de', place: 'Lisbon de' },
          { href: '/de/about#berlin', chapter: 'chapter 4 de', place: 'Berlin de' },
        ],
      },
    ]);
  });

  it('ABOUT-09: should open with the eyebrow, the one <h1> and the intro in the page language', () => {
    const page = render('de');
    expect({
      eyebrow: texts(page, '.page-head__eyebrow'),
      h1: texts(page, 'h1'),
      intro: texts(page, '.page-head__intro'),
    }).toEqual({ eyebrow: ['about eyebrow de'], h1: ['about heading de'], intro: ['about intro de'] });
  });
});
