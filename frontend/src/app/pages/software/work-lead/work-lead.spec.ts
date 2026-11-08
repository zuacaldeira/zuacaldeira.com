import { provideTestContent } from '../../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { WorkLead } from './work-lead';
import { I18nService } from '../../../services/i18n.service';

describe('WorkLead', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  const render = (lang: 'en' | 'de' | 'pt'): HTMLElement => {
    TestBed.inject(I18nService).setLanguage(lang);
    const fixture = TestBed.createComponent(WorkLead);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  const texts = (el: HTMLElement, selector: string) =>
    [...el.querySelectorAll(selector)].map((node) => node.textContent?.replace(/\s+/g, ' ').trim());

  it('SW-LEAD-01: should open with the kicker, the <h2> title and the status, in the page language', () => {
    const el = render('de');
    expect(texts(el, '.sw-lead__kicker')).toEqual(['kicker de']);
    expect(texts(el, 'h2')).toEqual(['title de']);
    expect(texts(el, '.sw-lead__status')).toEqual(['status de']);
  });

  it('SW-LEAD-02: should head its five blocks and the stack with <h3> labels, in order, each with its text', () => {
    const el = render('de');
    expect(texts(el, 'h3')).toEqual([
      'label question de',
      'label built de',
      'label protocol de',
      'label live de',
      'label result de',
      'label stack de',
    ]);
    const block = (label: string) =>
      [...el.querySelectorAll('.sw-lead__block')].find(
        (b) => b.querySelector('h3')?.textContent?.trim() === label,
      ) as HTMLElement;
    expect(texts(block('label question de'), 'p')).toEqual(['question de']);
    expect(texts(block('label built de'), 'p')).toEqual(['built de', 'built2 de']);
    expect(texts(block('label result de'), 'p')).toEqual(['result de']);
    expect(texts(block('label stack de'), 'p')).toEqual(['Python · pytest']);
  });
});
