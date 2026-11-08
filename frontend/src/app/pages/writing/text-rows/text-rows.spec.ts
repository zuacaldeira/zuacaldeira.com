import { provideTestContent } from '../../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { TextRows } from './text-rows';
import { I18nService } from '../../../services/i18n.service';

describe('TextRows', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  const render = (lang: 'en' | 'de' | 'pt'): HTMLElement => {
    TestBed.inject(I18nService).setLanguage(lang);
    const fixture = TestBed.createComponent(TextRows);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  const text = (el: Element | null) => el?.textContent?.replace(/\s+/g, ' ').trim();

  it('WR-LIST-01, 02: should list the texts in order under a hidden heading, each with year, kind, title, authors and venue', () => {
    const el = render('de');
    const h2 = el.querySelector('h2');
    expect(text(h2)).toBe('writing heading de');
    expect(h2?.classList).toContain('visually-hidden');
    const items = [...el.querySelectorAll('ul > li')].map((li) => ({
      year: text(li.querySelector('.wr-texts__year')),
      kind: text(li.querySelector('.wr-texts__kind')),
      title: text(li.querySelector('h3')),
      authors: text(li.querySelector('.wr-texts__authors')),
      venue: text(li.querySelector('.wr-texts__venue')),
    }));
    expect(items).toEqual([
      { year: '2026', kind: 'workshop de', title: 'A Paper', authors: 'A. Self', venue: 'W 2026 · A Workshop' },
      {
        year: '2010',
        kind: 'conference de',
        title: 'An Article',
        authors: 'B. Other, A. Z. Self',
        venue: 'C 2010 · A Conference',
      },
    ]);
  });
});
