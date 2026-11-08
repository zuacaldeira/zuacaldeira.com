import { provideTestContent } from '../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Writing } from './writing';
import { I18nService } from '../../services/i18n.service';

describe('Writing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  it('WR-PAGE-03 (D11): should title the page with the full name and its heading', () => {
    TestBed.inject(I18nService).setLanguage('de');
    TestBed.createComponent(Writing).detectChanges();
    expect(TestBed.inject(Title).getTitle()).toBe('Alexandre Zua Caldeira — writing heading de');
  });

  it('WR-HEAD-02: should open with the eyebrow, the one <h1> and the intro in the page language', () => {
    TestBed.inject(I18nService).setLanguage('de');
    const fixture = TestBed.createComponent(Writing);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;
    const texts = (selector: string) =>
      [...page.querySelectorAll(selector)].map((el) => el.textContent?.trim());
    expect(texts('.page-head__eyebrow')).toEqual(['writing eyebrow de']);
    expect(texts('h1')).toEqual(['writing heading de']);
    expect(texts('.page-head__intro')).toEqual(['writing intro de']);
  });
});
