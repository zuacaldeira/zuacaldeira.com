import { provideTestContent } from '../../content/content.testing';
import { TestBed } from '@angular/core/testing';
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

  it('ABOUT-09: should open with the eyebrow, the one <h1> and the intro in the page language', () => {
    const page = render('de');
    expect({
      eyebrow: texts(page, '.page-head__eyebrow'),
      h1: texts(page, 'h1'),
      intro: texts(page, '.page-head__intro'),
    }).toEqual({ eyebrow: ['about eyebrow de'], h1: ['about heading de'], intro: ['about intro de'] });
  });
});
