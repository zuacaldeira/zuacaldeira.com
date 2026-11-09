import { provideTestContent } from '../../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { PaperCard } from './paper-card';
import { I18nService } from '../../../services/i18n.service';

describe('PaperCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  const show = (lang: 'en' | 'de' | 'pt'): HTMLElement => {
    TestBed.inject(I18nService).setLanguage(lang);
    const fixture = TestBed.createComponent(PaperCard);
    fixture.detectChanges();
    return fixture.nativeElement;
  };
  const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

  it('RS-PAPER-01: should show the year and kind, the title, the author, the venue and the note', () => {
    const card = show('en');
    expect({
      when: text(card.querySelector('.rs-paper__when')),
      title: text(card.querySelector('h2')),
      author: text(card.querySelector('.rs-paper__author b')),
      venue: text(card.querySelector('.rs-paper__venue')),
      note: text(card.querySelector('.rs-paper__note')),
    }).toEqual({
      when: '2026 · paper kind en',
      title: 'Paper Title',
      author: 'Ann Author',
      venue: 'W 2026 · A Workshop',
      note: 'paper note en',
    });
  });

  it('RS-PAPER-02: should open the paper as a PDF from this site with one link, in the same tab', () => {
    const links = [...show('de').querySelectorAll('a')].map((a) => ({
      label: text(a),
      href: a.getAttribute('href'),
      type: a.getAttribute('type'),
      hreflang: a.getAttribute('hreflang'),
      target: a.getAttribute('target'),
    }));
    expect(links).toEqual([
      { label: 'read de', href: '/assets/pdfs/paper.pdf', type: 'application/pdf', hreflang: 'en', target: null },
    ]);
  });

  it('RS-PAPER-05: should keep the title, the author and the venue as published, the title marked English on de', () => {
    const marks = (lang: 'en' | 'de') => {
      const card = show(lang);
      const h2 = card.querySelector('h2');
      return {
        lang: h2?.getAttribute('lang') ?? null,
        translate: ['h2', '.rs-paper__author', '.rs-paper__venue'].map((s) =>
          card.querySelector(s)?.getAttribute('translate'),
        ),
      };
    };
    expect({ en: marks('en'), de: marks('de') }).toEqual({
      en: { lang: null, translate: ['no', 'no', 'no'] },
      de: { lang: 'en', translate: ['no', 'no', 'no'] },
    });
  });
});
