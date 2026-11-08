import { provideTestContent } from '../../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { HowStrip } from './how-strip';
import { I18nService } from '../../../services/i18n.service';

describe('HowStrip', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  const render = (lang: 'en' | 'de' | 'pt'): HTMLElement => {
    TestBed.inject(I18nService).setLanguage(lang);
    const fixture = TestBed.createComponent(HowStrip);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

  it('SW-HOW-01: should head the strip and list its three steps in order, each numbered', () => {
    const el = render('de');
    expect(text(el.querySelector('h2'))).toBe('how heading de');
    const steps = [...el.querySelectorAll('ol > li')].map((li) => [
      text(li.querySelector('.sw-how__n')),
      text(li.querySelector('h3')),
      text(li.querySelector('.sw-how__text')),
    ]);
    expect(steps).toEqual([
      ['01', 'step 1 de', 'sentence 1 de'],
      ['02', 'step 2 de', 'sentence 2 de'],
      ['03', 'step 3 de', 'sentence 3 de'],
    ]);
  });
});
