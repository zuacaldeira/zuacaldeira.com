import { provideTestContent } from '../../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { WorkRows } from './work-rows';
import { I18nService } from '../../../services/i18n.service';

describe('WorkRows', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  const render = (lang: 'en' | 'de' | 'pt'): HTMLElement => {
    TestBed.inject(I18nService).setLanguage(lang);
    const fixture = TestBed.createComponent(WorkRows);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  const text = (el: Element | null) => el?.textContent?.replace(/\s+/g, ' ').trim();

  it('SW-WORK-01: should head the section and show one row per piece, in order, in the page language', () => {
    const el = render('de');
    expect(text(el.querySelector('h2'))).toBe('work heading de');
    const rows = [...el.querySelectorAll('article')].map((row) => ({
      kicker: text(row.querySelector('.work-row__kicker')),
      title: text(row.querySelector('h3')),
      text: text(row.querySelector('.work-row__text')),
      stack: text(row.querySelector('.work-row__stack')),
    }));
    expect(rows).toEqual([
      { kicker: 'kicker first de', title: 'First', text: 'text first de', stack: 'Python' },
      { kicker: 'kicker second de', title: 'Second de', text: 'text second de', stack: 'Angular · Java' },
    ]);
  });

  it('SW-WORK-02 to 04: should give each row its own links, each label to its target', () => {
    const rows = [...render('pt').querySelectorAll('article')].map((row) =>
      [...row.querySelectorAll('a')].map((a) => `${text(a)} → ${a.getAttribute('href')}`),
    );
    expect(rows).toEqual([
      ['paper pt → /assets/pdfs/paper.pdf'],
      ['example.org → https://example.org', 'repo pt → https://github.com/example/second'],
    ]);
  });

  it('D27: should open links outside the site in a new tab, as the footer does, and the paper in this one', () => {
    const links = [...render('en').querySelectorAll('article a')].map(
      (a) => `${a.getAttribute('href')} ${a.getAttribute('target')} ${a.getAttribute('rel')}`,
    );
    expect(links).toEqual([
      '/assets/pdfs/paper.pdf null null',
      'https://example.org _blank noopener noreferrer',
      'https://github.com/example/second _blank noopener noreferrer',
    ]);
  });
});
