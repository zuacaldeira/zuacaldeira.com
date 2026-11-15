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
  const texts = (page: Element, selector: string) =>
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

  it('ABOUT-15 (D11): should head four chapters in route order with number, "of 4" label and the place, nothing more yet', () => {
    const page = render('pt');
    const chapters = [...page.querySelectorAll('.about-story section')].map((section) => {
      const h2 = section.querySelector('h2');
      return {
        id: section.id,
        labelledBy: section.getAttribute('aria-labelledby'),
        h2Id: h2?.id,
        place: h2?.textContent?.trim(),
        number: [...section.querySelectorAll('.about-chapter__number[aria-hidden="true"]')].map((n) =>
          n.textContent?.trim(),
        ),
        label: texts(section, '.about-chapter__label'),
        parts: section.querySelectorAll('*').length,
      };
    });
    const chapter = (n: number, id: string, place: string) => ({
      id,
      labelledBy: `h-${id}`,
      h2Id: `h-${id}`,
      place,
      number: [String(n)],
      label: [`chapter ${n} of 4 pt`],
      parts: 4, // a head holding the number, the label and the <h2>
    });
    expect(chapters).toEqual([
      chapter(1, 'piri', 'Piri'),
      chapter(2, 'estremoz', 'Estremoz'),
      chapter(3, 'lisbon', 'Lisbon pt'),
      chapter(4, 'berlin', 'Berlin pt'),
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
