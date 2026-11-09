import { provideTestContent } from '../../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { ResearchMore } from './research-more';
import { I18nService } from '../../../services/i18n.service';

describe('ResearchMore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  const show = (lang: 'en' | 'de' | 'pt'): HTMLElement => {
    TestBed.inject(I18nService).setLanguage(lang);
    const fixture = TestBed.createComponent(ResearchMore);
    fixture.detectChanges();
    return fixture.nativeElement;
  };
  const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

  it('RS-MORE-01, 02, 03: should lead to the earlier papers in this tab and to the profile in a new one, saying so', () => {
    const more = show('de');
    expect({
      heading: text(more.querySelector('h2')),
      links: [...more.querySelectorAll('ul > li > a')].map((a) => ({
        // What a reader sees: the link's own words, before the arrow and the hidden words.
        label: a.childNodes[0]?.textContent?.trim(),
        href: a.getAttribute('href'),
        target: a.getAttribute('target'),
        rel: a.getAttribute('rel'),
        arrow: a.querySelector('[aria-hidden="true"]')?.textContent ?? null,
        hidden: text(a.querySelector('.visually-hidden')) ?? null,
      })),
    }).toEqual({
      heading: 'more heading de',
      links: [
        { label: 'earlier de', href: '/de/writing', target: null, rel: null, arrow: null, hidden: null },
        {
          label: 'Profile',
          href: 'https://example.org/profile',
          target: '_blank',
          rel: 'noopener noreferrer',
          arrow: '↗',
          hidden: '(new tab de)',
        },
      ],
    });
  });
});
