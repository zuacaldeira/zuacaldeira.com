import { provideTestContent } from '../../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { PaperResults } from './paper-results';
import { I18nService } from '../../../services/i18n.service';

describe('PaperResults', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  const show = (lang: 'en' | 'de' | 'pt'): HTMLElement => {
    TestBed.inject(I18nService).setLanguage(lang);
    const fixture = TestBed.createComponent(PaperResults);
    fixture.detectChanges();
    return fixture.nativeElement;
  };
  const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();
  const read = (lang: 'en' | 'de') => {
    const results = show(lang);
    return {
      heading: text(results.querySelector('h2')),
      statements: [...results.querySelectorAll('blockquote')].map((quote) => {
        const body = quote.querySelector('.rs-results__text');
        return {
          label: text(quote.querySelector('.rs-results__label')),
          name: quote.querySelector('.rs-results__label [translate="no"]')?.textContent,
          text: text(body),
          translate: body?.getAttribute('translate'),
          lang: body?.getAttribute('lang') ?? null,
        };
      }),
      folded: results.querySelectorAll('details').length,
    };
  };

  const statements = (lang: 'en' | 'de', textLang: string | null) =>
    [
      ['theorem', 15, 'Name', 'For every S, a statement.'],
      ['definition', 6, 'Def', 'A definition.'],
      ['lemma', 8, 'Lem', 'A lemma.'],
      ['proposition', 18, 'Prop', 'A proposition.'],
    ].map(([kind, number, name, body]) => ({
      label: `${kind} ${lang} ${number} · ${name}`,
      name,
      text: body,
      translate: 'no',
      lang: textLang,
    }));

  it('RS-RES-01, 02: should show the heading, then the theorem and the three others in order, all open', () => {
    expect(read('en')).toEqual({ heading: 'results heading en', statements: statements('en', null), folded: 0 });
  });

  it('RS-RES-03: should label the statements in German on de and keep their names and texts as published', () => {
    expect(read('de')).toEqual({ heading: 'results heading de', statements: statements('de', 'en'), folded: 0 });
  });
});
