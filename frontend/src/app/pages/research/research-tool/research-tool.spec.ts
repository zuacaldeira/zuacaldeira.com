import { provideTestContent } from '../../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { ResearchTool } from './research-tool';
import { I18nService } from '../../../services/i18n.service';

describe('ResearchTool', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  const show = (lang: 'en' | 'de' | 'pt'): HTMLElement => {
    TestBed.inject(I18nService).setLanguage(lang);
    const fixture = TestBed.createComponent(ResearchTool);
    fixture.detectChanges();
    return fixture.nativeElement;
  };
  const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

  it('RS-TOOL-01: should name the tool, untranslated, with its kicker, text and stack, in the shared row', () => {
    const tool = show('de');
    const title = tool.querySelector('app-work-row h3');
    expect({
      heading: text(tool.querySelector('h2')),
      kicker: text(tool.querySelector('.work-row__kicker')),
      title: text(title),
      translate: title?.getAttribute('translate'),
      text: text(tool.querySelector('.work-row__text')),
      stack: text(tool.querySelector('.work-row__stack')),
    }).toEqual({
      heading: 'tool heading de',
      kicker: 'tool kicker de',
      title: 'reticulateP',
      translate: 'no',
      text: 'tool text de',
      stack: 'Python',
    });
  });

  it('RS-TOOL-02, RS-SHOT-01: should lead to the Software page in the same language and tab, and show no figure', () => {
    const tool = show('pt');
    expect({
      links: [...tool.querySelectorAll('a')].map((a) => ({
        label: text(a),
        href: a.getAttribute('href'),
        target: a.getAttribute('target'),
      })),
      figures: tool.querySelectorAll('figure, img').length,
    }).toEqual({ links: [{ label: 'tool link pt', href: '/pt/software', target: null }], figures: 0 });
  });
});
