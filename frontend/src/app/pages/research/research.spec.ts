import { provideTestContent } from '../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Research } from './research';
import { I18nService } from '../../services/i18n.service';

describe('Research', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  it('RS-PAGE-02: should title the page with the full name and its heading', () => {
    TestBed.inject(I18nService).setLanguage('pt');
    TestBed.createComponent(Research).detectChanges();
    expect(TestBed.inject(Title).getTitle()).toBe('Alexandre Zua Caldeira — research heading pt');
  });

  it('RS-HEAD-02, RS-PAGE-07: should open with the eyebrow, the one <h1> and the intro in the page language, and show nothing else', () => {
    TestBed.inject(I18nService).setLanguage('de');
    const fixture = TestBed.createComponent(Research);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;
    const texts = (selector: string) =>
      [...page.querySelectorAll(selector)].map((el) => el.textContent?.trim());
    expect(texts('.page-head__eyebrow')).toEqual(['research eyebrow de']);
    expect(texts('h1')).toEqual(['research heading de']);
    expect(texts('.page-head__intro')).toEqual(['research intro de']);
    // RS-PAGE-08: the head, the paper, what it proves, how it was checked; slice 4 adds the rest.
    expect([...page.children].map((el) => el.tagName)).toEqual([
      'APP-PAGE-HEAD',
      'APP-PAPER-CARD',
      'APP-PAPER-RESULTS',
      'APP-PAPER-CHECKS',
    ]);
  });

  it('RS-WALL-01 (D15): should show the wall in the head, right after the intro', () => {
    TestBed.inject(I18nService).setLanguage('en');
    const fixture = TestBed.createComponent(Research);
    fixture.detectChanges();
    const intro = (fixture.nativeElement as HTMLElement).querySelector('app-page-head .page-head__intro');
    expect(intro?.nextElementSibling?.tagName).toBe('APP-RESEARCH-WALL');
  });
});
